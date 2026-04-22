import { useEffect, useRef } from "react";
import webDefault, { createWebOCR } from "@luciaocr/web";

export * from "@luciaocr/web";
export { webDefault as default };

export function createReactOCR(options) {
  return createWebOCR(options);
}

export function useOCR(options = {}) {
  const ocrRef = useRef(null);

  if (!ocrRef.current) {
    ocrRef.current = createWebOCR(options);
  }

  useEffect(() => {
    const instance = ocrRef.current;
    return () => {
      instance?.destroy();
    };
  }, []);

  return ocrRef.current;
}
