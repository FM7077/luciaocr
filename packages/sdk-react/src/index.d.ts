export * from "@luciaocr/web";
export { default } from "@luciaocr/web";

import type { WebOCR, WebOCRInitOptions } from "@luciaocr/web";

export declare function createReactOCR(options?: WebOCRInitOptions): WebOCR;
export declare function useOCR(options?: WebOCRInitOptions): WebOCR;
