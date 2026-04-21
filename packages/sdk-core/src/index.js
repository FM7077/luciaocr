export const OCR_TEMPLATES = [
  "general",
  "idCard",
  "bankCard",
  "driverLicense",
];

export {
  parseGeneral,
  extractNumbersFromText,
  extractDatesFromText,
  extractEmailsFromText,
  extractPhonesFromText,
  extractUrlsFromText,
  extractKeywords,
  summarize,
} from "./templates/common.js";

export {
  parseIdCardFront,
  parseIdCardBack,
  parseIdCard,
  detectIdCardSide,
  mergeIdCardInfo,
  extractFromIdNumber,
  ID_CARD_FRONT_REGIONS,
  ID_CARD_BACK_REGIONS,
} from "./templates/idCard.js";

export {
  parseBankCard,
  getBankByBIN,
  getCardType,
  BANK_CARD_REGIONS,
} from "./templates/bankCard.js";

export {
  detectDriverLicensePage,
  parseDriverLicenseAuto,
  parseDriverLicense,
  parseDriverLicenseSubPage,
  checkLicenseValidity,
  getLicenseClassDescription,
  DRIVER_LICENSE_REGIONS,
  LICENSE_CLASS_DESC,
} from "./templates/driverLicense.js";

export * from "./utils/validators.js";
export * from "./utils/formatters.js";
export * from "./errors.js";
