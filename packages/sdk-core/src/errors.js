export const OCR_ERROR_CODES = [
  "ASSET_LOAD_FAILED",
  "ENGINE_INIT_FAILED",
  "UNSUPPORTED_IMAGE_SOURCE",
  "RECOGNIZE_TIMEOUT",
  "BRIDGE_ERROR",
  "PARSE_ERROR",
];

export class OCRError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "OCRError";
    this.code = code;
    this.details = details;
  }
}
