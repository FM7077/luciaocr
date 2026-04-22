import { onBeforeUnmount, shallowRef } from "vue";
import webDefault, { createWebOCR } from "@luciaocr/web";

export * from "@luciaocr/web";
export { webDefault as default };

export function createVueOCR(options) {
  return createWebOCR(options);
}

export function useOCR(options = {}) {
  const ocr = shallowRef(createWebOCR(options));

  onBeforeUnmount(() => {
    ocr.value?.destroy();
  });

  return ocr;
}
