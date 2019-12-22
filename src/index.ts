'use strict';
import { ExpressAppConfig } from "./middleware/express.app.config";

export function expressAppConfig(definitionPath: string, routingOptions): ExpressAppConfig {
  return new ExpressAppConfig(definitionPath, routingOptions);
}
