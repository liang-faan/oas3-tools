/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Apigee Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

const _ = require('lodash');
const  debug = require('debug')('oas3-tools:swagger-router');
const  fs = require('fs');
const  mHelpers = require('./helpers');
const  path = require('path');

var defaultOptions = {
  controllers: {},
  useStubs: false // not for now.
};
const  getHandlerName = function (req) {
  var handlerName;

  if (req.openapi.schema['x-swagger-router-controller']) {
    handlerName = req.openapi.schema['x-swagger-router-controller'] + '_' + (req.openapi.schema.operationId ? req.openapi.schema.operationId : req.method.toLowerCase());
  } else {
    handlerName = req.openapi.schema.operationId;
  }

  return handlerName;
};

const handlerCacheFromDir = function (dirOrDirs) {
  const  handlerCache = {};
  const  jsFileRegex = /\.(coffee|js|ts)$/;
  const  dirs = [];

  if (_.isArray(dirOrDirs)) {
    dirs = dirOrDirs;
  } else {
    dirs.push(dirOrDirs);
  }

  debug('  Controllers:');

  _.each(dirs, function (dir) {
    _.each(fs.readdirSync(dir), function (file) {
      var controllerName = file.replace(jsFileRegex, '');
      var controller;
      
      if (file.match(jsFileRegex) && file.indexOf(".test.js") === -1) {
        controller = require(path.resolve(path.join(dir, controllerName)));

        debug('    %s%s:',
              path.resolve(path.join(dir, file)),
              (_.isPlainObject(controller) ? '' : ' (not an object, skipped)'));

        if (_.isPlainObject(controller)) {
          _.each(controller, function (value, name) {
            var handlerId = controllerName + '_' + name;

            debug('      %s%s',
                  handlerId,
                  (_.isFunction(value) ? '' : ' (not a function, skipped)'));

            // TODO: Log this situation

            if (_.isFunction(value) && !handlerCache[handlerId]) {
              handlerCache[handlerId] = value;
            }
          });
        }
      }
    });
  });

  return handlerCache;
};

const  send405 = function (req, res, next) {
  var err = new Error('Route defined in OpenAPI specification (' + req.openapi.openApiRoute + ') but there is no defined on' + req.method.toUpperCase() + ' operation.');
  res.statusCode = 405;
  return next(err);
};

/**
 * Middleware for using Swagger information to route requests to handlers.
 *
 * This middleware also requires that you use the swagger-metadata middleware before this middleware.  This middleware
 * also makes no attempt to work around invalid Swagger documents.
 *
 * @param {object} [options] - The middleware options
 * @param {(string|object|string[]} [options.controllers=./controllers] - If this is a string or string array, this is
 *                                                                        the path, or paths, to find the controllers
 *                                                                        in.  If it's an object, the keys are the
 *                                                                        controller "name" (as described above) and the
 *                                                                        value is a function.
 *
 * @returns the middleware function
 */
export default function (options) {
  var handlerCache = {};

  debug('Initializing swagger-router middleware');

  // Set the defaults
  options = _.defaults(options || {}, defaultOptions);

  console.log('  Mock mode: %s', options.useStubs === true ? 'enabled' : 'disabled');

  if (_.isPlainObject(options.controllers)) {
    // Create the handler cache from the passed in controllers object
    _.each(options.controllers, function (func, handlerName) {
      console.log('    %s', handlerName);

      if (!_.isFunction(func)) {
        throw new Error('options.controllers values must be functions');
      }
    });

    handlerCache = options.controllers;
  } else {
    // Create the handler cache from the modules in the controllers directory
    handlerCache = handlerCacheFromDir(options.controllers);
  }

  return function swaggerRouter (req, res, next) {
    var operation = req.openapi ? req.openapi.schema.operationId : undefined;
    var handler;
    var handlerName;
    var rErr;

    debug('%s %s', req.method, req.url);
    debug('  Will process: %s', _.isUndefined(operation) ? 'no' : 'yes');

    if (operation) {
      handlerName = getHandlerName(req);
      handler = handlerCache[handlerName];

      debug('  Route handler: %s', handlerName);
      debug('    Missing: %s', _.isUndefined(handler) ? 'yes' : 'no');
      debug('    Ignored: %s', options.ignoreMissingHandlers === true ? 'yes' : 'no');

      if (_.isUndefined(handler)) {
        return send405(req, res, next);
      }

      if (!_.isUndefined(handler)) {
        try {
          return handler(req, res, next);
        } catch (err) {
          rErr = err;

            debug('Handler threw an unexpected error: %s\n%s', err.message, err.stack);
          }
        } else if (options.ignoreMissingHandlers !== true) {
          rErr = new Error('Cannot resolve the configured swagger-router handler: ' + handlerName);

        res.statusCode = 500;
      }
    } else {
      debug('  No handler for method: %s', req.method);

      return send405(req, res, next);
    }

    if (rErr) {
      mHelpers.debugError(rErr, debug);
    }

    return next(rErr);
  };
};
