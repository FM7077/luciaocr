function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
}

export function createEngineDocument(runtimeAssets) {
  const config = JSON.stringify(runtimeAssets);
  const ortUrl = escapeHtmlAttribute(runtimeAssets.scripts.ort);
  const openCvUrl = escapeHtmlAttribute(runtimeAssets.scripts.openCv);
  const engineSource = "luciaocr-rn-engine";
  const sdkSource = "luciaocr-rn-sdk";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>luciaocr React Native Engine</title>
    <script>
      window.__LF_OCR_RUNTIME_CONFIG__ = ${config};
    </script>
    <script src="${ortUrl}"></script>
    <script src="${openCvUrl}"></script>
    <style>
      html, body {
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
    </script>

    <script>
      const ENGINE_SOURCE = "${engineSource}";
      const runtimeConfig = window.__LF_OCR_RUNTIME_CONFIG__;
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      let isOCRReady = false;
      let isInitializing = false;
      let ocrFunction = null;

      function postToHost(payload) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            source: ENGINE_SOURCE,
            ...payload,
          })
        );
      }

      function postProgress(message) {
        postToHost({
          type: "OCR_PROGRESS",
          message,
        });
      }

      function configureOrtWasmPaths() {
        if (window.ort && window.ort.env && window.ort.env.wasm) {
          const wasmAssets = runtimeConfig.wasm || {};
          window.ort.env.wasm.wasmPaths =
            wasmAssets.mjs && wasmAssets.wasm
              ? {
                  mjs: wasmAssets.mjs,
                  wasm: wasmAssets.wasm,
                }
              : runtimeConfig.baseUrl;
        }
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
          configureOrtWasmPaths();

          postProgress("Loading OpenCV...");
          while (typeof window.cv === "undefined" || !window.cv.Mat) {
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
            message: error && error.message ? error.message : "Recognition failed",
          });
        }
      }

      window.__lfOcrReceiveFromHost = function receiveFromHost(message) {
        if (!message || message.source !== "${sdkSource}") {
          return;
        }

        if (message.type === "OCR_INIT") {
          initEngine();
          return;
        }

        if (message.type === "RECOGNIZE_REQUEST") {
          recognize(message);
          return;
        }

        if (message.type === "OCR_DESTROY") {
          isOCRReady = false;
          isInitializing = false;
          ocrFunction = null;
        }
      };

      postToHost({ type: "OCR_FRAME_READY" });
    </script>
  </body>
</html>`;
}

export default createEngineDocument;
