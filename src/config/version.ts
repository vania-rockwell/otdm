/**
 * Application Version Configuration
 */

export const APP_VERSION = "1.0.0";
export const APP_NAME = "Data Configuration Hub";
export const BUILD_DATE = new Date().toISOString();

export interface VersionInfo {
  version: string;
  name: string;
  buildDate: string;
}

export function getVersionInfo(): VersionInfo {
  return {
    version: APP_VERSION,
    name: APP_NAME,
    buildDate: BUILD_DATE,
  };
}
