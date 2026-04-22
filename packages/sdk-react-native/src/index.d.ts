import type { ComponentType } from "react";
import type {
  OCRResult,
  OCRTemplate,
} from "@luciaocr/luciaocr-core";

export interface ReactNativeImageSource {
  uri?: string;
  base64?: string;
}

export interface ReactNativeOCRInitOptions {
  assetResolver?: (input: {
    type: "runtime";
    path: string;
    defaultUrl: string;
  }) => string;
  initTimeout?: number;
  recognizeTimeout?: number;
  onProgress?: (message: string) => void;
}

export interface RuntimeAssetManifest {
  scripts: string[];
  wasm: string[];
  models: string[];
}

export interface OCRWebViewProps {
  controller?: ReactNativeOCR;
  assetResolver?: ReactNativeOCRInitOptions["assetResolver"];
  style?: unknown;
  webViewProps?: Record<string, unknown>;
}

export declare const SDK_REACT_NATIVE_VERSION: string;
export declare const DEFAULT_TEMPLATE: OCRTemplate;
export declare const runtimeAssets: RuntimeAssetManifest;

export declare class ReactNativeOCR {
  constructor(options?: ReactNativeOCRInitOptions);
  init(options?: ReactNativeOCRInitOptions): Promise<void>;
  recognize(
    input: string | ReactNativeImageSource,
    template?: OCRTemplate,
    options?: { recognizeTimeout?: number }
  ): Promise<OCRResult>;
  handleMessage(event: unknown): void;
  setWebViewRef(ref: unknown): void;
  destroy(): void;
  getVersion(): string;
  isInitialized(): boolean;
}

export declare const OCRWebView: ComponentType<OCRWebViewProps>;

export declare function createReactNativeOCR(
  options?: ReactNativeOCRInitOptions
): ReactNativeOCR;
export declare function createOCRController(
  options?: ReactNativeOCRInitOptions
): ReactNativeOCR;
export declare function initOCR(options?: ReactNativeOCRInitOptions): Promise<void>;
export declare function recognize(
  input: string | ReactNativeImageSource,
  template?: OCRTemplate,
  options?: { recognizeTimeout?: number }
): Promise<OCRResult>;
export declare function destroyOCR(): void;
export declare function getVersion(): string;
export declare function isInitialized(): boolean;

declare const defaultReactNativeOCR: ReactNativeOCR;
export default defaultReactNativeOCR;
