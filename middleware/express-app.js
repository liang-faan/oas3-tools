'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
var app = express();

exports = module.exports = function (definitionPath) {

    app.use(bodyParser.urlencoded());
    app.use(bodyParser.text());
    app.use(bodyParser.json());

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    new OpenApiValidator({
        apiSpec: definitionPath,
    }).install(app);

    app.use((err, req, res, next) => {
        // format errors
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    });

    return app;
};