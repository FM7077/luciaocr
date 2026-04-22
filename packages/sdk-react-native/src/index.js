import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import {
  OCRError,
  parseBankCard,
  parseDriverLicenseAuto,
  parseGeneral,
  parseIdCard,
} from "@luciaocr/luciaocr-core";
import createEngineDocument from "./engineDocument.js";
import {
  createRuntimeAssetResolver,
  runtimeAssets as runtimeAssetManifest,
} from "./runtimeAssets.js";

export const SDK_REACT_NATIVE_VERSION = "1.0.0";
export const DEFAULT_TEMPLATE = "general";
const RN_ENGINE_SOURCE = "luciaocr-rn-engine";
const RN_SDK_SOURCE = "luciaocr-rn-sdk";

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

function normalizeImageSource(input) {
  if (typeof input === "string") {
    return Promise.resolve(input);
  }

  if (input && typeof input === "object") {
    if (typeof input.uri === "string") {
      return Promise.resolve(input.uri);
    }

    if (typeof input.base64 === "string") {
      return Promise.resolve(
        input.base64.startsWith("data:")
          ? input.base64
          : `data:image/jpeg;base64,${input.base64}`
      );
    }
  }

  return Promise.reject(
    new OCRError(
      "UNSUPPORTED_IMAGE_SOURCE",
      "Image source must be a URI string, { uri }, or { base64 } object"
    )
  );
}

export class ReactNativeOCR {
  constructor(options = {}) {
    this.assetResolver = options.assetResolver || null;
    this.initTimeout = options.initTimeout ?? 30000;
    this.recognizeTimeout = options.recognizeTimeout ?? 60000;
    this.onProgress = options.onProgress || null;
    this.runtimeAssets = createRuntimeAssetResolver(this.assetResolver);
    this.webViewRef = null;
    this.frameReady = false;
    this.isReady = false;
    this.initPromise = null;
    this.pendingRequests = new Map();
    this.requestCounter = 0;
  }

  getEngineDocument() {
    return createEngineDocument(this.runtimeAssets);
  }

  setWebViewRef(ref) {
    this.webViewRef = ref;
  }

  setRuntimeOptions(options = {}) {
    if (options.assetResolver) {
      this.assetResolver = options.assetResolver;
      this.runtimeAssets = createRuntimeAssetResolver(this.assetResolver);
    }
    if (typeof options.initTimeout === "number") {
      this.initTimeout = options.initTimeout;
    }
    if (typeof options.recognizeTimeout === "number") {
      this.recognizeTimeout = options.recognizeTimeout;
    }
    if (options.onProgress) {
      this.onProgress = options.onProgress;
    }
  }

  postToWebView(message) {
    if (!this.webViewRef) {
      throw new OCRError("BRIDGE_ERROR", "OCR WebView is not attached");
    }

    const payload = JSON.stringify({
      source: RN_SDK_SOURCE,
      ...message,
    });

    this.webViewRef.injectJavaScript(
      `window.__lfOcrReceiveFromHost(${payload}); true;`
    );
  }

  async init(options = {}) {
    this.setRuntimeOptions(options);

    if (this.isReady) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.initPromise = null;
        reject(
          new OCRError(
            "ENGINE_INIT_FAILED",
            "OCR engine initialization timed out"
          )
        );
      }, this.initTimeout);

      this.pendingRequests.set("__init__", {
        resolve: () => {
          clearTimeout(timeoutId);
          this.isReady = true;
          this.initPromise = null;
          resolve();
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          this.initPromise = null;
          reject(error);
        },
      });

      const kickOff = () => {
        try {
          this.postToWebView({ type: "OCR_INIT" });
        } catch (error) {
          this.pendingRequests.delete("__init__");
          clearTimeout(timeoutId);
          this.initPromise = null;
          reject(error);
        }
      };

      if (this.frameReady) {
        kickOff();
      } else {
        this.pendingRequests.set("__init_kickoff__", { resolve: kickOff });
      }
    });

    return this.initPromise;
  }

  async recognize(input, template = DEFAULT_TEMPLATE, options = {}) {
    if (typeof options.recognizeTimeout === "number") {
      this.recognizeTimeout = options.recognizeTimeout;
    }

    if (!this.isReady) {
      throw new OCRError(
        "ENGINE_INIT_FAILED",
        "OCR engine is not initialized. Call initOCR first."
      );
    }

    const imageSrc = await normalizeImageSource(input);
    const requestId = `ocr_${++this.requestCounter}`;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new OCRError("RECOGNIZE_TIMEOUT", "OCR recognition timed out"));
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

      this.postToWebView({
        type: "RECOGNIZE_REQUEST",
        requestId,
        template,
        imageSrc,
      });
    });
  }

  handleMessage(event) {
    let message = event?.nativeEvent?.data ?? event?.data ?? event;

    if (typeof message === "string") {
      try {
        message = JSON.parse(message);
      } catch (_error) {
        return;
      }
    }

    if (!message || message.source !== RN_ENGINE_SOURCE) {
      return;
    }

    if (message.type === "OCR_FRAME_READY") {
      this.frameReady = true;
      const kickoff = this.pendingRequests.get("__init_kickoff__");
      if (kickoff) {
        this.pendingRequests.delete("__init_kickoff__");
        kickoff.resolve();
      }
      return;
    }

    if (message.type === "OCR_PROGRESS") {
      if (this.onProgress) {
        this.onProgress(message.message);
      }
      return;
    }

    if (message.type === "OCR_READY") {
      const pending = this.pendingRequests.get("__init__");
      if (pending) {
        this.pendingRequests.delete("__init__");
        pending.resolve();
      }
      return;
    }

    if (message.type === "OCR_ERROR" && !message.requestId) {
      const pending = this.pendingRequests.get("__init__");
      if (pending) {
        this.pendingRequests.delete("__init__");
        pending.reject(
          new OCRError(
            "ENGINE_INIT_FAILED",
            message.message || "OCR engine init failed"
          )
        );
      }
      return;
    }

    const pendingRequest = this.pendingRequests.get(message.requestId);
    if (!pendingRequest) {
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
    if (this.webViewRef && this.frameReady) {
      this.postToWebView({ type: "OCR_DESTROY" });
    }

    this.pendingRequests.clear();
    this.frameReady = false;
    this.isReady = false;
    this.initPromise = null;
  }

  getVersion() {
    return SDK_REACT_NATIVE_VERSION;
  }

  isInitialized() {
    return this.isReady;
  }
}

export const OCRWebView = forwardRef(function OCRWebView(
  {
    controller,
    assetResolver,
    style,
    webViewProps,
  },
  ref
) {
    const webViewRef = useRef(null);
    const resolvedController = useMemo(() => {
      if (controller) {
        controller.setRuntimeOptions({ assetResolver });
        return controller;
      }

      return new ReactNativeOCR({ assetResolver });
    }, [assetResolver, controller]);

    const source = useMemo(
      () => ({
        html: resolvedController.getEngineDocument(),
        baseUrl: resolvedController.runtimeAssets.baseUrl || undefined,
      }),
      [resolvedController]
    );

    useImperativeHandle(ref, () => ({
      reload: () => webViewRef.current?.reload(),
      getController: () => resolvedController,
    }));

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={(instance) => {
            webViewRef.current = instance;
            resolvedController.setWebViewRef(instance);
          }}
          originWhitelist={["*"]}
          javaScriptEnabled
          allowFileAccess
          allowingReadAccessToURL={resolvedController.runtimeAssets.baseUrl || undefined}
          mixedContentMode="always"
          source={source}
          onMessage={(event) => resolvedController.handleMessage(event)}
          {...webViewProps}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: 1,
    height: 1,
    opacity: 0,
    position: "absolute",
    left: -9999,
    top: -9999,
  },
});

const defaultReactNativeOCR = new ReactNativeOCR();

export const runtimeAssets = runtimeAssetManifest;
export const createReactNativeOCR = (options) => new ReactNativeOCR(options);
export const createOCRController = createReactNativeOCR;
export const initOCR = (options) => defaultReactNativeOCR.init(options);
export const recognize = (input, template, options) =>
  defaultReactNativeOCR.recognize(input, template, options);
export const destroyOCR = () => defaultReactNativeOCR.destroy();
export const getVersion = () => defaultReactNativeOCR.getVersion();
export const isInitialized = () => defaultReactNativeOCR.isInitialized();

export default defaultReactNativeOCR;
