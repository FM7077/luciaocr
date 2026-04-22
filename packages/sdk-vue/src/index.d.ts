export * from "@luciaocr/web";
export { default } from "@luciaocr/web";

import type { ShallowRef } from "vue";
import type { WebOCR, WebOCRInitOptions } from "@luciaocr/web";

export declare function createVueOCR(options?: WebOCRInitOptions): WebOCR;
export declare function useOCR(options?: WebOCRInitOptions): ShallowRef<WebOCR>;
