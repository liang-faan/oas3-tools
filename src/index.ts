'use strict';

import { SwaggerRouter } from "./middleware/swagger.router";
import { ExpressAppConfig } from "./middleware/express.app.config";

export function swaggerRouter(): SwaggerRouter {
  return new SwaggerRouter();
}

export function expressAppConfig(definitionPath: string): ExpressAppConfig {
  return new ExpressAppConfig(definitionPath);
}
