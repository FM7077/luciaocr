import {
  SDK_WEB_VERSION,
  WebOCR,
  createWebOCR,
  destroyOCR,
  getVersion,
  initOCR,
  isInitialized,
  recognize,
  runtimeAssets,
} from "@luciaocr/luciaocr-r";

SDK_WEB_VERSION satisfies string;
runtimeAssets.engineHtml satisfies string;
runtimeAssets.models[0] satisfies string;

const instance = createWebOCR({
  assetBaseUrl: "/ocr-runtime/",
  initTimeout: 1000,
  recognizeTimeout: 2000,
  onProgress(message) {
    message satisfies string;
  },
});

instance satisfies WebOCR;
instance.getVersion() satisfies string;
instance.isInitialized() satisfies boolean;

initOCR({
  assetResolver({ path, defaultUrl }) {
    path satisfies string;
    return defaultUrl;
  },
});

recognize("https://example.com/image.png", "general", {
  recognizeTimeout: 5000,
});

destroyOCR();
getVersion() satisfies string;
isInitialized() satisfies boolean;
