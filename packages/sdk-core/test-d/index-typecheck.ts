import {
  OCRError,
  OCR_ERROR_CODES,
  OCR_TEMPLATES,
  parseBankCard,
  parseDriverLicenseAuto,
  parseGeneral,
  parseIdCard,
  validateBankCard,
} from "@luciaocr/core";

const general = parseGeneral("电话 13800138000");
general.valid satisfies boolean;
general.extracted?.phones?.[0]?.number satisfies string | undefined;

const idCard = parseIdCard(
  "姓名 张三 公民身份号码 11010519491231002X",
  ["姓名 张三", "公民身份号码 11010519491231002X"]
);
idCard.side satisfies "front" | "back" | "unknown" | undefined;

const bankCard = parseBankCard("中国农业银行 6228480402564890018");
bankCard.cardNumber satisfies string | undefined;

const driverLicense = parseDriverLicenseAuto(
  "姓名 张三 准驾车型 C1 有效期限 2020.05.06至2030.05.06",
  ["姓名 张三", "准驾车型 C1", "有效期限 2020.05.06至2030.05.06"]
);
driverLicense.licenseClass satisfies string | undefined;

const validation = validateBankCard("6228480402564890018");
validation.valid satisfies boolean;

OCR_TEMPLATES[0] satisfies string;
OCR_ERROR_CODES[0] satisfies string;

new OCRError("PARSE_ERROR", "parse failed") satisfies Error;
