export * from "@luciaocr/web";
export { default } from "@luciaocr/web";

import type { EnvironmentProviders, InjectionToken } from "@angular/core";
import type { WebOCR, WebOCRInitOptions } from "@luciaocr/web";

export declare const LUCIAOCR: InjectionToken<WebOCR>;
export declare function createAngularOCR(options?: WebOCRInitOptions): WebOCR;
export declare function provideLuciaocr(
  options?: WebOCRInitOptions
): EnvironmentProviders;
export declare function injectLuciaocr(): WebOCR;
