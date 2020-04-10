'use strict';
import { ExpressAppConfig } from "./middleware/express.app.config";

export function expressAppConfig(definitionPath: string, appOptions): ExpressAppConfig {
  return new ExpressAppConfig(definitionPath, appOptions);
}
