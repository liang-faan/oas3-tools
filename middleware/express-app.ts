'use strict';

import * as express from 'express';
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import logger = require('morgan');
import { OpenApiValidator } from 'express-openapi-validator';
const app: express.Application = express();

export default function(definitionPath) {

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
}