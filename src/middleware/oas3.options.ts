import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/framework/types';
import { LoggingOptions} from './logging.options'

export class Oas3AppOptions {
    public routing: any;
    public openApiValidator: OpenApiValidatorOpts;
    public logging: LoggingOptions;

    constructor(routingOpts: any, openApiValidatorOpts: OpenApiValidatorOpts, logging: LoggingOptions) {
        this.routing = routingOpts;
        this.openApiValidator = openApiValidatorOpts;
        if (!logging )
        logging = new LoggingOptions(null,null);
        this.logging = logging;
    }
}