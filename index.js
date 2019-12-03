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

var _ = require('lodash');
var debug = require('debug');

var initializeMiddleware = function initializeMiddleware (definition, callback) {
  debug('Initializing middleware');

  if (_.isUndefined(definition)) {
    throw new Error('OpenAPI 3 document is required');
  } else if (!_.isPlainObject(definition)) {
    throw new TypeError('OpenAPI 3 document must be an object');
  }
  callback({
    swaggerRouter: require('./middleware/swagger-router'),
    swaggerSecurity: require('./middleware/swagger-security'),
    swaggerUi: function (options) {
      const swaggerUi = require('./middleware/swagger-ui');
      const suArgs = [definition];
      suArgs.push(options || {});

      return swaggerUi.apply(undefined, suArgs);
    },
  });
};

module.exports = {
  initializeMiddleware: initializeMiddleware,
  expressApp: require('./middleware/express-app'),
};
