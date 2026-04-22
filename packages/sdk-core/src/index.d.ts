export type OCRTemplate =
  | "general"
  | "idCard-CN"
  | "bankCard"
  | "driverLicense-CN";

export declare const OCR_TEMPLATES: OCRTemplate[];

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

export declare const OCR_ERROR_CODES: OCRErrorCode[];

export declare class OCRError extends Error {
  code: OCRErrorCode;
  details?: unknown;
  constructor(code: OCRErrorCode, message: string, details?: unknown);
}

export interface ValidationResult<TInfo = unknown> {
  valid: boolean;
  message: string;
  info?: TInfo | null;
}

export interface ExpiryValidationResult<TInfo = unknown>
  extends ValidationResult<TInfo> {
  isExpired: boolean;
  isLongTerm?: boolean;
  daysUntilExpiry?: number;
}

export interface CarrierValidationResult extends ValidationResult {
  carrier: string;
}

export interface LicenseClassValidationResult extends ValidationResult {
  description: string;
}

export function parseGeneral(text: string, options?: Record<string, unknown>): GeneralTextResult;
export function parseIdCard(text: string, lines?: string[]): IdCardResult;
export function parseIdCardFront(text: string, lines?: string[]): IdCardResult;
export function parseIdCardBack(text: string, lines?: string[]): IdCardResult;
export function detectIdCardSide(text: string): "front" | "back" | "unknown";
export function mergeIdCardInfo(front: IdCardResult, back: IdCardResult): IdCardResult;
export function extractFromIdNumber(idNumber: string): Record<string, unknown> | null;

export function parseBankCard(text: string): BankCardResult;
export function getBankByBIN(cardNumber: string): Record<string, unknown> | null;
export function getCardType(cardNumber: string): string;

export function detectDriverLicensePage(text: string): "main" | "sub" | "unknown";
export function parseDriverLicense(text: string, lines?: string[]): DriverLicenseResult;
export function parseDriverLicenseSubPage(text: string, lines?: string[]): DriverLicenseResult;
export function parseDriverLicenseAuto(text: string, lines?: string[]): DriverLicenseResult;
export function checkLicenseValidity(license: DriverLicenseResult): Record<string, unknown>;
export function getLicenseClassDescription(licenseClass: string): string;

export function extractNumbersFromText(text: string): Array<{ value: string; numeric: number }>;
export function extractDatesFromText(text: string): Array<{ original: string; formatted: string | null }>;
export function extractEmailsFromText(text: string): string[];
export function extractPhonesFromText(text: string): Array<{ number: string; type: string }>;
export function extractUrlsFromText(text: string): string[];
export function extractKeywords(text: string, topN?: number): Array<{ word: string; count: number }>;
export function summarize(text: string, maxLength?: number): string;

export function isValidDate(year: number, month: number, day: number): boolean;
export function validateIdCard(idNumber: string): ValidationResult<{
  region: string;
  birthDate: string;
  gender: string;
  age: number;
}>;
export function formatIdCard(idNumber: string, maskChar?: string): {
  full: string;
  masked: string;
  birthOnly: string;
} | null;
export function validateIdCardValidPeriod(startDate: string, endDate: string): ExpiryValidationResult;
export function validateBankCard(cardNumber: string): ValidationResult<{
  length: number;
  bin: string;
}>;
export function validateBankCardExpiry(expiry: string): ExpiryValidationResult;
export function formatBankCard(cardNumber: string): string;
export function maskBankCard(cardNumber: string, maskChar?: string): string;
export function validateDriverLicenseNumber(licenseNumber: string): ValidationResult;
export function validateArchiveNumber(archiveNumber: string): ValidationResult;
export function validateLicenseClass(licenseClass: string): LicenseClassValidationResult;
export function validateDriverLicenseValidPeriod(startDate: string, endDate: string): ExpiryValidationResult;
export function validatePhone(phone: string): CarrierValidationResult;
export function validateEmail(email: string): ValidationResult;
export function validateLicensePlate(plateNumber: string): ValidationResult<{
  province: string;
  city: string;
  type: string;
}>;

export function formatDate(date: Date | string | number, format?: string): string;
export function formatAmount(amount: number | string, options?: Record<string, unknown>): string;
export function formatFileSize(bytes: number, decimals?: number): string;
export function formatDuration(ms: number): string;
export function formatPercentage(value: number, options?: Record<string, unknown>): string;
export function formatPhone(phone: string, maskChar?: string): string;
export function formatName(name: string, maskChar?: string): string;
export function formatAddress(address: string, keepLength?: number): string;
export function formatOCRResult(result: OCRResultBase): OCRResultBase | null;
export function chineseToNumber(chineseNum: string): number;
export function numberToChinese(num: number): string;
