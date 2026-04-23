import type { ComponentType } from "react";

export type OCRTemplate =
  | "general"
  | "idCard-CN"
  | "bankCard"
  | "driverLicense-CN";

export interface OCRResultBase {
  text?: string;
  rawText?: string;
  lines?: string[];
  duration?: number;
  valid: boolean;
}

export interface GeneralTextResult extends OCRResultBase {
  cleanText?: string;
  wordCount?: number;
  charCount?: number;
  extracted?: {
    numbers?: Array<{ value: string; numeric: number }>;
    dates?: Array<{ original: string; formatted: string | null }>;
    emails?: string[];
    phones?: Array<{ number: string; type: string }>;
    urls?: string[];
  };
}

export interface IdCardResult extends OCRResultBase {
  side?: "front" | "back" | "unknown";
  name?: string;
  gender?: string;
  ethnicity?: string;
  birthDate?: string;
  address?: string;
  idNumber?: string;
  authority?: string;
  validPeriod?: {
    start: string;
    end: string;
  };
  isExpired?: boolean;
}

export interface BankCardResult extends OCRResultBase {
  cardNumber?: string;
  cardNumberFormatted?: string;
  bankName?: string;
  cardType?: string;
  expiryDate?: string;
  holderName?: string;
  isExpired?: boolean;
}

export interface DriverLicenseResult extends OCRResultBase {
  page?: "main" | "sub" | "unknown";
  licenseNumber?: string;
  name?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  birthDate?: string;
  firstIssueDate?: string;
  licenseClass?: string;
  licenseClassDesc?: string;
  validPeriod?: {
    start: string;
    end: string;
  };
  issueAuthority?: string;
  archiveNumber?: string;
  record?: string;
  isExpired?: boolean;
}

export type OCRResult =
  | GeneralTextResult
  | IdCardResult
  | BankCardResult
  | DriverLicenseResult;

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
