import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/framework/types';
import { LoggingOptions} from './logging.options'

export class Oas3AppOptions {
    public routing: any;
    public openApiValidator: OpenApiValidatorOpts;
    public logging: LoggingOptions;

    constructor(routingOpts: any, openApiValidatorOpts: OpenApiValidatorOpts) {
        this.routing = routingOpts;
        this.openApiValidator = openApiValidatorOpts;
    }
}