import { Image } from "react-native";

const runtimeAssetModules = {
  scripts: {
    ort: require("./runtime/ort.min.js"),
    openCv: require("./runtime/opencv.js"),
    esearchOcr: require("./runtime/esearch-ocr.js"),
  },
  wasm: {
    "ort-wasm-simd-threaded.wasm": require("./runtime/ort-wasm-simd-threaded.wasm"),
    "ort-wasm-simd-threaded.mjs": require("./runtime/ort-wasm-simd-threaded.mjs"),
    "ort-wasm-simd-threaded.jsep.wasm": require("./runtime/ort-wasm-simd-threaded.jsep.wasm"),
    "ort-wasm-simd-threaded.jsep.mjs": require("./runtime/ort-wasm-simd-threaded.jsep.mjs"),
  },
  models: {
    det: require("./runtime/models/ppocr_det.onnx"),
    rec: require("./runtime/models/ppocr_rec.onnx"),
    dict: require("./runtime/models/ppocr_keys_v1.txt"),
  },
};

function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

function resolveAssetUri(assetModule) {
  const resolved = Image.resolveAssetSource(assetModule);

  if (!resolved || !resolved.uri) {
    throw new Error("Failed to resolve React Native OCR runtime asset");
  }

  return resolved.uri;
}

function inferBaseUrl(scriptUri) {
  const lastSlashIndex = scriptUri.lastIndexOf("/");
  if (lastSlashIndex === -1) {
    return null;
  }

  return ensureTrailingSlash(scriptUri.slice(0, lastSlashIndex + 1));
}

export function createRuntimeAssetResolver(assetResolver) {
  const defaultAssets = {
    scripts: {
      ort: resolveAssetUri(runtimeAssetModules.scripts.ort),
      openCv: resolveAssetUri(runtimeAssetModules.scripts.openCv),
      esearchOcr: resolveAssetUri(runtimeAssetModules.scripts.esearchOcr),
    },
    wasm: {
      "ort-wasm-simd-threaded.wasm": resolveAssetUri(
        runtimeAssetModules.wasm["ort-wasm-simd-threaded.wasm"]
      ),
      "ort-wasm-simd-threaded.mjs": resolveAssetUri(
        runtimeAssetModules.wasm["ort-wasm-simd-threaded.mjs"]
      ),
      "ort-wasm-simd-threaded.jsep.wasm": resolveAssetUri(
        runtimeAssetModules.wasm["ort-wasm-simd-threaded.jsep.wasm"]
      ),
      "ort-wasm-simd-threaded.jsep.mjs": resolveAssetUri(
        runtimeAssetModules.wasm["ort-wasm-simd-threaded.jsep.mjs"]
      ),
    },
    models: {
      det: resolveAssetUri(runtimeAssetModules.models.det),
      rec: resolveAssetUri(runtimeAssetModules.models.rec),
      dict: resolveAssetUri(runtimeAssetModules.models.dict),
    },
  };

  const resolveWithOverride = (path, defaultUrl) => {
    if (!assetResolver) {
      return defaultUrl;
    }

    return (
      assetResolver({
        type: "runtime",
        path,
        defaultUrl,
      }) || defaultUrl
    );
  };

  return {
    baseUrl: inferBaseUrl(defaultAssets.scripts.ort),
    scripts: {
      ort: resolveWithOverride("ort.min.js", defaultAssets.scripts.ort),
      openCv: resolveWithOverride("opencv.js", defaultAssets.scripts.openCv),
      esearchOcr: resolveWithOverride(
        "esearch-ocr.js",
        defaultAssets.scripts.esearchOcr
      ),
    },
    wasm: {
      "ort-wasm-simd-threaded.wasm": resolveWithOverride(
        "ort-wasm-simd-threaded.wasm",
        defaultAssets.wasm["ort-wasm-simd-threaded.wasm"]
      ),
      "ort-wasm-simd-threaded.mjs": resolveWithOverride(
        "ort-wasm-simd-threaded.mjs",
        defaultAssets.wasm["ort-wasm-simd-threaded.mjs"]
      ),
      "ort-wasm-simd-threaded.jsep.wasm": resolveWithOverride(
        "ort-wasm-simd-threaded.jsep.wasm",
        defaultAssets.wasm["ort-wasm-simd-threaded.jsep.wasm"]
      ),
      "ort-wasm-simd-threaded.jsep.mjs": resolveWithOverride(
        "ort-wasm-simd-threaded.jsep.mjs",
        defaultAssets.wasm["ort-wasm-simd-threaded.jsep.mjs"]
      ),
    },
    models: {
      det: resolveWithOverride("models/ppocr_det.onnx", defaultAssets.models.det),
      rec: resolveWithOverride("models/ppocr_rec.onnx", defaultAssets.models.rec),
      dict: resolveWithOverride(
        "models/ppocr_keys_v1.txt",
        defaultAssets.models.dict
      ),
    },
  };
}

export const runtimeAssets = {
  scripts: [
    "ort.min.js",
    "opencv.js",
    "esearch-ocr.js",
  ],
  wasm: [
    "ort-wasm-simd-threaded.wasm",
    "ort-wasm-simd-threaded.mjs",
    "ort-wasm-simd-threaded.jsep.wasm",
    "ort-wasm-simd-threaded.jsep.mjs",
  ],
  models: [
    "models/ppocr_det.onnx",
    "models/ppocr_rec.onnx",
    "models/ppocr_keys_v1.txt",
  ],
};

export default runtimeAssetModules;
