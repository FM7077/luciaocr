import {
  OCRError,
  parseBankCard,
  parseDriverLicenseAuto,
  parseGeneral,
  parseIdCard,
} from "@luciaocr/core";

export const SDK_WEB_VERSION = "1.0.1";
export const DEFAULT_TEMPLATE = "general";
const WEB_ENGINE_SOURCE = "luciaocr-web-engine";
const WEB_SDK_SOURCE = "luciaocr-web-sdk";
const RUNTIME_ASSET_MANIFEST = {
  engineHtml: "ocr.html",
  scripts: ["ort.min.js", "opencv.js", "esearch-ocr.js"],
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

const DEFAULT_RUNTIME_ASSETS = {
  scripts: {
    ort: new URL("./runtime/ort.min.js", import.meta.url).href,
    openCv: new URL("./runtime/opencv.js", import.meta.url).href,
    esearchOcr: new URL("./runtime/esearch-ocr.js", import.meta.url).href,
  },
  wasm: {
    "ort-wasm-simd-threaded.wasm": new URL(
      "./runtime/ort-wasm-simd-threaded.wasm",
      import.meta.url
    ).href,
    "ort-wasm-simd-threaded.mjs": new URL(
      "./runtime/ort-wasm-simd-threaded.mjs",
      import.meta.url
    ).href,
    "ort-wasm-simd-threaded.jsep.wasm": new URL(
      "./runtime/ort-wasm-simd-threaded.jsep.wasm",
      import.meta.url
    ).href,
    "ort-wasm-simd-threaded.jsep.mjs": new URL(
      "./runtime/ort-wasm-simd-threaded.jsep.mjs",
      import.meta.url
    ).href,
  },
  models: {
    det: new URL("./runtime/models/ppocr_det.onnx", import.meta.url).href,
    rec: new URL("./runtime/models/ppocr_rec.onnx", import.meta.url).href,
    dict: new URL("./runtime/models/ppocr_keys_v1.txt", import.meta.url).href,
  },
};

function withTrailingSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

function normalizeBaseUrl(assetBaseUrl) {
  if (!assetBaseUrl) {
    return null;
  }

  const baseUrl = withTrailingSlash(assetBaseUrl);

  try {
    return new URL(baseUrl).toString();
  } catch (_error) {
    if (typeof window !== "undefined" && window.location) {
      return new URL(baseUrl, window.location.href).toString();
    }

    if (typeof document !== "undefined" && document.baseURI) {
      return new URL(baseUrl, document.baseURI).toString();
    }

    return baseUrl;
  }
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
}

function createEngineDocument(runtimeAssets) {
  const config = JSON.stringify(runtimeAssets);
  const ortUrl = escapeHtmlAttribute(runtimeAssets.scripts.ort);
  const openCvUrl = escapeHtmlAttribute(runtimeAssets.scripts.openCv);

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>luciaocr Web Engine</title>
    <script>
      window.__LF_OCR_RUNTIME_CONFIG__ = ${config};
    </script>
    <script src="${ortUrl}"></script>
    <script src="${openCvUrl}"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: transparent;
      }

      canvas {
        display: none;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas"></canvas>

    <script type="module">
      const runtimeConfig = window.__LF_OCR_RUNTIME_CONFIG__;
      const { init: paddleInit, ocr: paddleOCR } = await import(
        runtimeConfig.scripts.esearchOcr
      );

      window.Paddle = {
        init: paddleInit,
        recognize: paddleOCR,
      };

      window.dispatchEvent(new Event("paddleReady"));
    </script>

    <script>
      const ENGINE_SOURCE = "${WEB_ENGINE_SOURCE}";
      const HOST_SOURCE = "${WEB_SDK_SOURCE}";
      const runtimeConfig = window.__LF_OCR_RUNTIME_CONFIG__;
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      let isOCRReady = false;
      let isInitializing = false;
      let ocrFunction = null;
      let hostOrigin = "*";

      function postToHost(payload) {
        window.parent.postMessage(
          {
            source: ENGINE_SOURCE,
            ...payload,
          },
          hostOrigin
        );
      }

      function postProgress(message) {
        postToHost({
          type: "OCR_PROGRESS",
          message,
        });
      }

      async function requestText(url, errorMessage) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(errorMessage);
        }
        return response.text();
      }

      async function requestBlobUrl(url, errorMessage) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(errorMessage);
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }

      async function initEngine() {
        if (isOCRReady) {
          postToHost({ type: "OCR_READY" });
          return;
        }

        if (isInitializing) {
          return;
        }

        isInitializing = true;

        try {
          if (window.ort && window.ort.env && window.ort.env.wasm) {
            window.ort.env.wasm.wasmPaths = runtimeConfig.baseUrl || runtimeConfig.wasm;
          }

          postProgress("Loading OpenCV...");
          while (typeof cv === "undefined" || !cv.Mat) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          postProgress("Loading PaddleOCR...");
          while (typeof window.Paddle === "undefined") {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          postProgress("Loading OCR dictionary...");
          const dictionary = await requestText(
            runtimeConfig.models.dict,
            "Failed to load OCR dictionary"
          );

          postProgress("Loading detection model...");
          const detBlobUrl = await requestBlobUrl(
            runtimeConfig.models.det,
            "Failed to load OCR detection model"
          );

          postProgress("Loading recognition model...");
          const recBlobUrl = await requestBlobUrl(
            runtimeConfig.models.rec,
            "Failed to load OCR recognition model"
          );

          const paddleResult = await window.Paddle.init({
            detPath: detBlobUrl,
            recPath: recBlobUrl,
            dic: dictionary,
            ort: window.ort,
            node: false,
            cv: window.cv,
          });

          ocrFunction = paddleResult.ocr;
          isOCRReady = true;
          isInitializing = false;

          postToHost({ type: "OCR_READY" });
        } catch (error) {
          isInitializing = false;
          console.error("[luciaocr] Engine init failed", error);
          postToHost({
            type: "OCR_ERROR",
            message: error && error.message ? error.message : "Engine init failed",
          });
        }
      }

      function loadImage(src) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error("Image load failed"));
          image.src = src;
        });
      }

      async function recognize(message) {
        const { requestId, imageSrc } = message;

        if (!isOCRReady || !ocrFunction) {
          postToHost({
            type: "OCR_ERROR",
            requestId,
            message: "Engine is not initialized",
          });
          return;
        }

        try {
          const startTime = Date.now();
          const image = await loadImage(imageSrc);

          const maxSize = 1200;
          let width = image.width;
          let height = image.height;

          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          const result = await ocrFunction(imageData);
          const rawLines = Array.isArray(result.src) ? result.src : [];
          const lines = rawLines
            .map((item) => (typeof item === "string" ? item : item.text || ""))
            .filter(Boolean)
            .filter((line) => line.length <= 50)
            .filter((line) => {
              if (/[\\u4e00-\\u9fa5\\d]/.test(line)) {
                return true;
              }
              if (line.length > 10) {
                return false;
              }
              return !/Sex|Date|Birth|Address|Name|Republic/i.test(line);
            });

          postToHost({
            type: "OCR_RESULT",
            requestId,
            duration: Date.now() - startTime,
            lines,
            text: lines.join("\\n"),
          });
        } catch (error) {
          postToHost({
            type: "OCR_ERROR",
            requestId,
            message: error.message || "Recognition failed",
          });
        }
      }

      window.addEventListener("message", (event) => {
        const message = event.data;
        if (!message || message.source !== HOST_SOURCE) {
          return;
        }

        hostOrigin = event.origin || "*";

        if (message.type === "OCR_INIT") {
          initEngine();
          return;
        }

        if (message.type === "OCR_RECOGNIZE") {
          recognize(message);
          return;
        }

        if (message.type === "OCR_DESTROY") {
          isOCRReady = false;
          isInitializing = false;
          ocrFunction = null;
        }
      });

      postToHost({ type: "OCR_FRAME_READY" });
    </script>
  </body>
</html>`;
}

function resolveAssetUrl(relativePath, importedUrl, assetBaseUrl, assetResolver) {
  const normalizedBaseUrl = normalizeBaseUrl(assetBaseUrl);
  const defaultUrl = normalizedBaseUrl
    ? new URL(relativePath, normalizedBaseUrl).toString()
    : importedUrl;

  if (!assetResolver) {
    return defaultUrl;
  }

  return (
    assetResolver({
      type: "runtime",
      path: relativePath,
      defaultUrl,
    }) || defaultUrl
  );
}

function createRuntimeAssets(assetBaseUrl, assetResolver) {
  const normalizedBaseUrl = normalizeBaseUrl(assetBaseUrl);

  return {
    baseUrl: normalizedBaseUrl,
    scripts: {
      ort: resolveAssetUrl(
        "ort.min.js",
        DEFAULT_RUNTIME_ASSETS.scripts.ort,
        normalizedBaseUrl,
        assetResolver
      ),
      openCv: resolveAssetUrl(
        "opencv.js",
        DEFAULT_RUNTIME_ASSETS.scripts.openCv,
        normalizedBaseUrl,
        assetResolver
      ),
      esearchOcr: resolveAssetUrl(
        "esearch-ocr.js",
        DEFAULT_RUNTIME_ASSETS.scripts.esearchOcr,
        normalizedBaseUrl,
        assetResolver
      ),
    },
    wasm: {
      "ort-wasm-simd-threaded.wasm": resolveAssetUrl(
        "ort-wasm-simd-threaded.wasm",
        DEFAULT_RUNTIME_ASSETS.wasm["ort-wasm-simd-threaded.wasm"],
        normalizedBaseUrl,
        assetResolver
      ),
      "ort-wasm-simd-threaded.mjs": resolveAssetUrl(
        "ort-wasm-simd-threaded.mjs",
        DEFAULT_RUNTIME_ASSETS.wasm["ort-wasm-simd-threaded.mjs"],
        normalizedBaseUrl,
        assetResolver
      ),
      "ort-wasm-simd-threaded.jsep.wasm": resolveAssetUrl(
        "ort-wasm-simd-threaded.jsep.wasm",
        DEFAULT_RUNTIME_ASSETS.wasm["ort-wasm-simd-threaded.jsep.wasm"],
        normalizedBaseUrl,
        assetResolver
      ),
      "ort-wasm-simd-threaded.jsep.mjs": resolveAssetUrl(
        "ort-wasm-simd-threaded.jsep.mjs",
        DEFAULT_RUNTIME_ASSETS.wasm["ort-wasm-simd-threaded.jsep.mjs"],
        normalizedBaseUrl,
        assetResolver
      ),
    },
    models: {
      det: resolveAssetUrl(
        "models/ppocr_det.onnx",
        DEFAULT_RUNTIME_ASSETS.models.det,
        normalizedBaseUrl,
        assetResolver
      ),
      rec: resolveAssetUrl(
        "models/ppocr_rec.onnx",
        DEFAULT_RUNTIME_ASSETS.models.rec,
        normalizedBaseUrl,
        assetResolver
      ),
      dict: resolveAssetUrl(
        "models/ppocr_keys_v1.txt",
        DEFAULT_RUNTIME_ASSETS.models.dict,
        normalizedBaseUrl,
        assetResolver
      ),
    },
  };
}

function normalizeImageSource(input) {
  if (typeof input === "string") {
    return Promise.resolve(input);
  }

  const isFile = typeof File !== "undefined" && input instanceof File;
  const isBlob = typeof Blob !== "undefined" && input instanceof Blob;

  if (isFile || isBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () =>
        reject(
          new OCRError(
            "UNSUPPORTED_IMAGE_SOURCE",
            "Failed to read image input"
          )
        );
      reader.readAsDataURL(input);
    });
  }

  return Promise.reject(
    new OCRError(
      "UNSUPPORTED_IMAGE_SOURCE",
      "Image source must be a URL, base64 string, File, or Blob"
    )
  );
}

function parseTemplateResult(template, payload) {
  const lines = payload.lines || [];
  const rawText = payload.text || lines.join("\n") || "";
  let parsed;

  try {
    if (template === "idCard") {
      parsed = parseIdCard(rawText, lines);
    } else if (template === "bankCard") {
      parsed = parseBankCard(rawText);
    } else if (template === "driverLicense") {
      parsed = parseDriverLicenseAuto(rawText, lines);
    } else {
      parsed = parseGeneral(rawText);
    }
  } catch (error) {
    throw new OCRError(
      "PARSE_ERROR",
      error.message || "Failed to parse OCR result",
      error
    );
  }

  return {
    ...parsed,
    text: parsed.text || rawText,
    rawText,
    lines,
    duration: payload.duration || 0,
    valid: typeof parsed.valid === "boolean" ? parsed.valid : true,
  };
}

export class WebOCR {
  constructor(options = {}) {
    this.assetBaseUrl = options.assetBaseUrl || null;
    this.assetResolver = options.assetResolver || null;
    this.initTimeout = options.initTimeout ?? 30000;
    this.recognizeTimeout = options.recognizeTimeout ?? 60000;
    this.onProgress = options.onProgress || null;
    this.iframe = null;
    this.isReady = false;
    this.initPromise = null;
    this.pendingRequests = new Map();
    this.requestCounter = 0;
    this.handleMessage = this.handleMessage.bind(this);
  }

  resolveRuntimeAssets() {
    return createRuntimeAssets(this.assetBaseUrl, this.assetResolver);
  }

  createFrame() {
    if (typeof document === "undefined") {
      throw new OCRError(
        "BRIDGE_ERROR",
        "WebOCR requires a browser document to mount the hidden iframe"
      );
    }

    if (this.iframe) {
      return this.iframe;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.border = "0";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.srcdoc = createEngineDocument(this.resolveRuntimeAssets());

    this.iframe = iframe;
    document.body.appendChild(iframe);
    return iframe;
  }

  postToFrame(message) {
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new OCRError("BRIDGE_ERROR", "OCR frame is not available");
    }

    this.iframe.contentWindow.postMessage(
      {
        source: WEB_SDK_SOURCE,
        ...message,
      },
      "*"
    );
  }

  async init(options = {}) {
    if (typeof window === "undefined" || typeof document === "undefined") {
      throw new OCRError(
        "BRIDGE_ERROR",
        "WebOCR requires a browser window and document"
      );
    }

    if (this.isReady) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.onProgress = options.onProgress || this.onProgress;
    if (options.assetBaseUrl) {
      this.assetBaseUrl = options.assetBaseUrl;
    }
    if (options.assetResolver) {
      this.assetResolver = options.assetResolver;
    }
    if (typeof options.initTimeout === "number") {
      this.initTimeout = options.initTimeout;
    }
    if (typeof options.recognizeTimeout === "number") {
      this.recognizeTimeout = options.recognizeTimeout;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const iframe = this.createFrame();
      const timeoutId = setTimeout(() => {
        this.initPromise = null;
        reject(
          new OCRError(
            "ENGINE_INIT_FAILED",
            "OCR engine initialization timed out"
          )
        );
      }, this.initTimeout);

      const onFrameLoad = () => {
        this.postToFrame({
          type: "OCR_INIT",
        });
      };

      const initRequest = {
        resolve: () => {
          clearTimeout(timeoutId);
          iframe.removeEventListener("load", onFrameLoad);
          this.isReady = true;
          this.initPromise = null;
          resolve();
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          iframe.removeEventListener("load", onFrameLoad);
          this.initPromise = null;
          reject(error);
        },
      };

      this.pendingRequests.set("__init__", initRequest);
      window.addEventListener("message", this.handleMessage);
      iframe.addEventListener("load", onFrameLoad);

      if (
        iframe.contentDocument &&
        iframe.contentDocument.readyState === "complete"
      ) {
        onFrameLoad();
      }
    });

    return this.initPromise;
  }

  async recognize(input, template = DEFAULT_TEMPLATE, options = {}) {
    if (!this.isReady) {
      throw new OCRError(
        "ENGINE_INIT_FAILED",
        "OCR engine is not initialized. Call initOCR first."
      );
    }

    if (typeof options.recognizeTimeout === "number") {
      this.recognizeTimeout = options.recognizeTimeout;
    }

    const imageSrc = await normalizeImageSource(input);
    const requestId = `ocr_${++this.requestCounter}`;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(
          new OCRError("RECOGNIZE_TIMEOUT", "OCR recognition timed out")
        );
      }, this.recognizeTimeout);

      this.pendingRequests.set(requestId, {
        template,
        resolve: (payload) => {
          clearTimeout(timeoutId);
          try {
            resolve(parseTemplateResult(template, payload));
          } catch (error) {
            reject(error);
          }
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
      });

      this.postToFrame({
        type: "OCR_RECOGNIZE",
        requestId,
        template,
        imageSrc,
      });
    });
  }

  handleMessage(event) {
    if (!this.iframe || event.source !== this.iframe.contentWindow) {
      return;
    }

    const message = event.data;
    if (!message || message.source !== WEB_ENGINE_SOURCE) {
      return;
    }

    if (message.type === "OCR_PROGRESS") {
      if (this.onProgress) {
        this.onProgress(message.message);
      }
      return;
    }

    if (message.type === "OCR_FRAME_READY") {
      return;
    }

    if (message.type === "OCR_READY") {
      const initRequest = this.pendingRequests.get("__init__");
      if (initRequest) {
        this.pendingRequests.delete("__init__");
        initRequest.resolve();
      }
      return;
    }

    const pendingRequest = this.pendingRequests.get(message.requestId);
    if (!pendingRequest) {
      const initRequest = this.pendingRequests.get("__init__");
      if (message.type === "OCR_ERROR" && initRequest) {
        this.pendingRequests.delete("__init__");
        initRequest.reject(
          new OCRError(
            "ENGINE_INIT_FAILED",
            message.message || "OCR engine init failed"
          )
        );
      }
      return;
    }

    this.pendingRequests.delete(message.requestId);

    if (message.type === "OCR_RESULT") {
      pendingRequest.resolve(message);
      return;
    }

    if (message.type === "OCR_ERROR") {
      pendingRequest.reject(
        new OCRError(
          "ASSET_LOAD_FAILED",
          message.message || "OCR recognition failed"
        )
      );
    }
  }

  destroy() {
    if (this.iframe) {
      this.postToFrame({ type: "OCR_DESTROY" });
      this.iframe.remove();
      this.iframe = null;
    }

    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.handleMessage);
    }
    this.pendingRequests.clear();
    this.isReady = false;
    this.initPromise = null;
  }

  getVersion() {
    return SDK_WEB_VERSION;
  }

  isInitialized() {
    return this.isReady;
  }
}

const defaultWebOCR = new WebOCR();

export const runtimeAssets = RUNTIME_ASSET_MANIFEST;
export const initOCR = (options) => defaultWebOCR.init(options);
export const recognize = (input, template, options) =>
  defaultWebOCR.recognize(input, template, options);
export const destroyOCR = () => defaultWebOCR.destroy();
export const getVersion = () => defaultWebOCR.getVersion();
export const isInitialized = () => defaultWebOCR.isInitialized();
export const createWebOCR = (options) => new WebOCR(options);

export default defaultWebOCR;
