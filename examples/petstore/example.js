'use strict';

var path = require('path');
var http = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = 8080;

function validate(req, secDef, token, next) {
    console.log(token);
    console.log(req);
    console.log(secDef);
}

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    logging: {
        format: 'combined',
        errorLimit: 400
    },
    openApiValidator: {

        securityHandlers: {
            // your security settings
            ApiKeyAuth: validate
        }
    }
}; 


var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/petstore.yaml'), options);
expressAppConfig.addValidator();
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
