import {
  InjectionToken,
  inject,
  makeEnvironmentProviders,
} from "@angular/core";
import webDefault, { createWebOCR } from "@luciaocr/web";

export * from "@luciaocr/web";
export { webDefault as default };

export const LUCIAOCR = new InjectionToken("LUCIAOCR");

export function createAngularOCR(options) {
  return createWebOCR(options);
}

export function provideLuciaocr(options = {}) {
  return makeEnvironmentProviders([
    {
      provide: LUCIAOCR,
      useFactory: () => createWebOCR(options),
    },
  ]);
}

export function injectLuciaocr() {
  return inject(LUCIAOCR);
}
