import type { EnvironmentProviders, InjectionToken } from "@angular/core";

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

export type OCRErrorCode =
  | "ASSET_LOAD_FAILED"
  | "ENGINE_INIT_FAILED"
  | "UNSUPPORTED_IMAGE_SOURCE"
  | "RECOGNIZE_TIMEOUT"
  | "BRIDGE_ERROR"
  | "PARSE_ERROR";

export declare class OCRError extends Error {
  code: OCRErrorCode;
  details?: unknown;
  constructor(code: OCRErrorCode, message: string, details?: unknown);
}

export interface WebOCRInitOptions {
  assetBaseUrl?: string;
  assetResolver?: (input: {
    type: "runtime";
    path: string;
    defaultUrl: string;
  }) => string;
  initTimeout?: number;
  recognizeTimeout?: number;
  onProgress?: (message: string) => void;
}

export interface WebOCRRecognizeOptions {
  recognizeTimeout?: number;
}

export interface RuntimeAssetManifest {
  engineHtml: string;
  scripts: string[];
  wasm: string[];
  models: string[];
}

export declare const SDK_WEB_VERSION: string;
export declare const DEFAULT_TEMPLATE: OCRTemplate;
export declare const runtimeAssets: RuntimeAssetManifest;

export declare class WebOCR {
  constructor(options?: WebOCRInitOptions);
  init(options?: WebOCRInitOptions): Promise<void>;
  recognize(
    input: string | File | Blob,
    template?: OCRTemplate,
    options?: WebOCRRecognizeOptions
  ): Promise<OCRResult>;
  destroy(): void;
  getVersion(): string;
  isInitialized(): boolean;
}

export declare function createWebOCR(options?: WebOCRInitOptions): WebOCR;
export declare function initOCR(options?: WebOCRInitOptions): Promise<void>;
export declare function recognize(
  input: string | File | Blob,
  template?: OCRTemplate,
  options?: WebOCRRecognizeOptions
): Promise<OCRResult>;
export declare function destroyOCR(): void;
export declare function getVersion(): string;
export declare function isInitialized(): boolean;

export declare const LUCIAOCR: InjectionToken<WebOCR>;
export declare function createAngularOCR(options?: WebOCRInitOptions): WebOCR;
export declare function provideLuciaocr(
  options?: WebOCRInitOptions
): EnvironmentProviders;
export declare function injectLuciaocr(): WebOCR;

declare const defaultAngularOCR: WebOCR;
export default defaultAngularOCR;
