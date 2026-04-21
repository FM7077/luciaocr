/**
 * 银行卡识别模板
 *
 * @author luciaocr
 * @version 1.0.0
 * @description 根据规范更新的校验规则
 */

import {
  validateBankCard,
  validateBankCardExpiry,
  formatBankCard,
} from "../utils/validators.js";

/**
 * 银行卡字段区域（相对比例）
 */
export const BANK_CARD_REGIONS = {
  cardNumber: { x: 0.08, y: 0.4, width: 0.84, height: 0.2 },
  bankName: { x: 0.05, y: 0.05, width: 0.6, height: 0.15 },
  expiryDate: { x: 0.08, y: 0.65, width: 0.3, height: 0.1 },
  holderName: { x: 0.08, y: 0.75, width: 0.5, height: 0.12 },
};

/**
 * 银行 BIN 码数据库（前6位对应银行）
 */
/**
 * 银行 BIN 码数据库 (精简版覆盖主流与常见地方行)
 * 键为BIN号(3-6位)，值为 { bank: "银行名", type: "卡种" }
 */
const BANK_BIN_DATABASE = {
  // ==================== 国有五大行 ====================
  // 中国工商银行 (ICBC)
  622202: { bank: "中国工商银行", type: "借记卡" },
  622203: { bank: "中国工商银行", type: "借记卡" },
  621225: { bank: "中国工商银行", type: "借记卡" },
  621226: { bank: "中国工商银行", type: "借记卡" },
  620058: { bank: "中国工商银行", type: "借记卡" },
  621281: { bank: "中国工商银行", type: "借记卡" },
  621558: { bank: "中国工商银行", type: "借记卡" },
  621559: { bank: "中国工商银行", type: "借记卡" },
  621722: { bank: "中国工商银行", type: "借记卡" },
  621723: { bank: "中国工商银行", type: "借记卡" },
  622200: { bank: "中国工商银行", type: "借记卡" },
  622208: { bank: "中国工商银行", type: "借记卡" },
  620556: { bank: "中国工商银行", type: "借记卡" },
  9558: { bank: "中国工商银行", type: "借记卡" },

  // 中国农业银行 (ABC)
  622848: { bank: "中国农业银行", type: "借记卡" },
  622849: { bank: "中国农业银行", type: "借记卡" },
  622846: { bank: "中国农业银行", type: "借记卡" },
  622845: { bank: "中国农业银行", type: "借记卡" },
  622844: { bank: "中国农业银行", type: "借记卡" },
  622843: { bank: "中国农业银行", type: "借记卡" },
  622842: { bank: "中国农业银行", type: "借记卡" },
  622841: { bank: "中国农业银行", type: "借记卡" },
  622840: { bank: "中国农业银行", type: "借记卡" },
  622839: { bank: "中国农业银行", type: "借记卡" },
  622838: { bank: "中国农业银行", type: "借记卡" },
  622837: { bank: "中国农业银行", type: "借记卡" },
  622836: { bank: "中国农业银行", type: "借记卡" },
  622828: { bank: "中国农业银行", type: "借记卡" },
  623052: { bank: "中国农业银行", type: "借记卡" },
  621282: { bank: "中国农业银行", type: "借记卡" },
  621570: { bank: "中国农业银行", type: "借记卡" },
  621689: { bank: "中国农业银行", type: "借记卡" },
  620569: { bank: "中国农业银行", type: "借记卡" },
  623253: { bank: "中国农业银行", type: "借记卡" },
  9559: { bank: "中国农业银行", type: "借记卡" },

  // 中国银行 (BOC)
  621660: { bank: "中国银行", type: "借记卡" },
  621661: { bank: "中国银行", type: "借记卡" },
  621662: { bank: "中国银行", type: "借记卡" },
  621663: { bank: "中国银行", type: "借记卡" },
  621667: { bank: "中国银行", type: "借记卡" },
  621668: { bank: "中国银行", type: "借记卡" },
  621669: { bank: "中国银行", type: "借记卡" },
  621666: { bank: "中国银行", type: "借记卡" },
  622750: { bank: "中国银行", type: "借记卡" },
  622751: { bank: "中国银行", type: "借记卡" },
  622760: { bank: "中国银行", type: "借记卡" },
  622770: { bank: "中国银行", type: "借记卡" },
  601382: { bank: "中国银行", type: "借记卡" },
  456351: { bank: "中国银行", type: "借记卡" },
  95566: { bank: "中国银行", type: "借记卡" },
  9550: { bank: "中国银行", type: "借记卡" },

  // 中国建设银行 (CCB)
  621700: { bank: "中国建设银行", type: "借记卡" },
  621284: { bank: "中国建设银行", type: "借记卡" },
  622700: { bank: "中国建设银行", type: "借记卡" },
  622707: { bank: "中国建设银行", type: "借记卡" },
  622280: { bank: "中国建设银行", type: "借记卡" },
  621286: { bank: "中国建设银行", type: "借记卡" },
  621288: { bank: "中国建设银行", type: "借记卡" },
  621290: { bank: "中国建设银行", type: "借记卡" },
  621298: { bank: "中国建设银行", type: "借记卡" },
  621340: { bank: "中国建设银行", type: "借记卡" },
  620059: { bank: "中国建设银行", type: "借记卡" },
  620060: { bank: "中国建设银行", type: "借记卡" },
  436742: { bank: "中国建设银行", type: "贷记卡" },
  436745: { bank: "中国建设银行", type: "贷记卡" },
  9552: { bank: "中国建设银行", type: "借记卡" },

  // 交通银行 (BOCOM)
  622260: { bank: "交通银行", type: "借记卡" },
  622261: { bank: "交通银行", type: "借记卡" },
  622262: { bank: "交通银行", type: "借记卡" },
  622260: { bank: "交通银行", type: "借记卡" },
  621436: { bank: "交通银行", type: "借记卡" },
  621379: { bank: "交通银行", type: "借记卡" },
  621378: { bank: "交通银行", type: "借记卡" },
  620061: { bank: "交通银行", type: "借记卡" },
  601428: { bank: "交通银行", type: "借记卡" },
  95559: { bank: "交通银行", type: "借记卡" },

  // 中国邮政储蓄银行 (PSBC)
  621096: { bank: "中国邮政储蓄银行", type: "借记卡" },
  621098: { bank: "中国邮政储蓄银行", type: "借记卡" },
  621798: { bank: "中国邮政储蓄银行", type: "借记卡" },
  621799: { bank: "中国邮政储蓄银行", type: "借记卡" },
  621095: { bank: "中国邮政储蓄银行", type: "借记卡" },
  620062: { bank: "中国邮政储蓄银行", type: "借记卡" },

  // ==================== 股份制商业银行 ====================
  // 招商银行 (CMB)
  622580: { bank: "招商银行", type: "借记卡" },
  622588: { bank: "招商银行", type: "借记卡" },
  621483: { bank: "招商银行", type: "借记卡" },
  621485: { bank: "招商银行", type: "借记卡" },
  621486: { bank: "招商银行", type: "借记卡" },
  621286: { bank: "招商银行", type: "借记卡" },
  622609: { bank: "招商银行", type: "借记卡" },
  622575: { bank: "招商银行", type: "借记卡" },
  622576: { bank: "招商银行", type: "借记卡" },
  95555: { bank: "招商银行", type: "借记卡" },

  // 浦发银行 (SPDB)
  621792: { bank: "浦发银行", type: "借记卡" },
  622521: { bank: "浦发银行", type: "借记卡" },
  622522: { bank: "浦发银行", type: "借记卡" },
  622516: { bank: "浦发银行", type: "借记卡" },
  622517: { bank: "浦发银行", type: "借记卡" },
  622518: { bank: "浦发银行", type: "借记卡" },
  620520: { bank: "浦发银行", type: "借记卡" },
  620521: { bank: "浦发银行", type: "借记卡" },
  95528: { bank: "浦发银行", type: "借记卡" },

  // 中信银行 (CITIC)
  622690: { bank: "中信银行", type: "借记卡" },
  622691: { bank: "中信银行", type: "借记卡" },
  622692: { bank: "中信银行", type: "借记卡" },
  622696: { bank: "中信银行", type: "借记卡" },
  622698: { bank: "中信银行", type: "借记卡" },
  621768: { bank: "中信银行", type: "借记卡" },
  621769: { bank: "中信银行", type: "借记卡" },
  621770: { bank: "中信银行", type: "借记卡" },
  621773: { bank: "中信银行", type: "借记卡" },
  95558: { bank: "中信银行", type: "借记卡" },

  // 兴业银行 (CIB)
  622908: { bank: "兴业银行", type: "借记卡" },
  622909: { bank: "兴业银行", type: "借记卡" },
  622901: { bank: "兴业银行", type: "借记卡" },
  622902: { bank: "兴业银行", type: "借记卡" },
  622903: { bank: "兴业银行", type: "借记卡" },
  622904: { bank: "兴业银行", type: "借记卡" },
  622905: { bank: "兴业银行", type: "借记卡" },
  622906: { bank: "兴业银行", type: "借记卡" },

  // 民生银行 (CMBC)
  622622: { bank: "中国民生银行", type: "借记卡" },
  622617: { bank: "中国民生银行", type: "借记卡" },
  622619: { bank: "中国民生银行", type: "借记卡" },
  622620: { bank: "中国民生银行", type: "借记卡" },
  622621: { bank: "中国民生银行", type: "借记卡" },
  622600: { bank: "中国民生银行", type: "借记卡" },
  621691: { bank: "中国民生银行", type: "借记卡" },
  621692: { bank: "中国民生银行", type: "借记卡" },

  // 平安银行
  622155: { bank: "平安银行", type: "借记卡" },
  622156: { bank: "平安银行", type: "借记卡" },
  622126: { bank: "平安银行", type: "借记卡" },
  622148: { bank: "平安银行", type: "借记卡" },
  622149: { bank: "平安银行", type: "借记卡" },
  621626: { bank: "平安银行", type: "借记卡" },

  // 光大银行 (CEB)
  622663: { bank: "光大银行", type: "借记卡" },
  622664: { bank: "光大银行", type: "借记卡" },
  622665: { bank: "光大银行", type: "借记卡" },
  622666: { bank: "光大银行", type: "借记卡" },
  622667: { bank: "光大银行", type: "借记卡" },
  622650: { bank: "光大银行", type: "借记卡" },
  622655: { bank: "光大银行", type: "借记卡" },
  622656: { bank: "光大银行", type: "借记卡" },

  // ==================== 国际卡组织 ====================
  4: { bank: "VISA", type: "贷记卡" },
  51: { bank: "Mastercard", type: "贷记卡" },
  52: { bank: "Mastercard", type: "贷记卡" },
  53: { bank: "Mastercard", type: "贷记卡" },
  54: { bank: "Mastercard", type: "贷记卡" },
  55: { bank: "Mastercard", type: "贷记卡" },
  34: { bank: "American Express", type: "贷记卡" },
  37: { bank: "American Express", type: "贷记卡" },
};

/**
 * 解析银行卡信息
 * @param {string} text - OCR 识别的原始文本
 * @returns {Object} 解析后的银行卡信息
 */
export function parseBankCard(text) {
  const result = {
    cardNumber: "",
    cardNumberFormatted: "",
    bankName: "",
    cardType: "",
    expiryDate: "",
    holderName: "",
    valid: false,
    isValid: false,
    isExpired: false,
    validation: null,
    expiryValidation: null,
    validationDetails: {},
  };

  // 清理文本，保留数字和必要字符
  const cleanText = text.replace(/\s+/g, " ").trim();

  // ========== 银行卡号提取 ==========
  // 支持 13-19 位数字（最常见 16 或 19 位）
  const cardPatterns = [
    // 宽松模式：匹配任何看起来像长数字串的东西，忽略间隔
    // 能够处理 "6 22203" 这种被 OCR 拆开的情况
    /(?:\d[\s-]*){13,19}/g,
    // 标准格式：4位一组，空格或横线分隔
    /(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{0,3})/g,
    // 连续数字 13-19 位
    /(\d{13,19})/g,
    // 识别错误的O替换为0
    /([O0-9]{13,19})/gi,
  ];

  let longestCardNumber = "";

  for (const pattern of cardPatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      for (const match of matches) {
        // 清理并验证
        let cardNum = match
          .replace(/[\s-]/g, "")
          .replace(/O/gi, "0")
          .replace(/[^0-9]/g, "");

        // 检查长度 13-19 位
        if (cardNum.length >= 13 && cardNum.length <= 19) {
          // 取最长的有效卡号
          if (cardNum.length > longestCardNumber.length) {
            longestCardNumber = cardNum;
          }
        }
      }
    }
  }

  if (longestCardNumber) {
    result.cardNumber = longestCardNumber;
    result.cardNumberFormatted = formatBankCard(longestCardNumber);
    result.validation = validateBankCard(longestCardNumber);

    // 根据 BIN 码识别银行和卡类型
    const bankInfo = getBankByBIN(longestCardNumber);
    if (bankInfo) {
      result.bankName = bankInfo.bank;
      result.cardType = bankInfo.type;
    }
  }

  // 如果 BIN 码没识别到银行，尝试从文本中提取银行名称
  if (!result.bankName) {
    const bankNamePatterns = [
      /(中国工商银行|工商银行|ICBC)/i,
      /(中国建设银行|建设银行|CCB)/i,
      /(中国农业银行|农业银行|ABC)/i,
      /(中国银行|BOC)/i,
      /(交通银行|BOCOM)/i,
      /(招商银行|CMB)/i,
      /(中国民生银行|民生银行|CMBC)/i,
      /(中信银行|CITIC)/i,
      /(光大银行|CEB)/i,
      /(兴业银行|CIB)/i,
      /(浦发银行|上海浦东发展银行|SPDB)/i,
      /(华夏银行|HXB)/i,
      /(中国邮政储蓄银行|邮储银行|PSBC)/i,
      /(平安银行|PAB)/i,
    ];

    for (const pattern of bankNamePatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        result.bankName = match[1];
        break;
      }
    }
  }

  // ========== 有效期提取 ==========
  // 格式 MM/YY 或 MM/YYYY
  const expiryPatterns = [
    /有效期[：:]?\s*(0[1-9]|1[0-2])\/(\d{2}|\d{4})/i,
    /VALID\s*(?:THRU|UNTIL|DATE)?\s*[：:]?\s*(0[1-9]|1[0-2])\/(\d{2}|\d{4})/i,
    /(?:^|\s)(0[1-9]|1[0-2])\/(\d{2})(?!\d)/,
    /\b(0[1-9]|1[0-2])\/(\d{2})\b/, // 简单粗暴的 MM/YY
  ];

  for (const pattern of expiryPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const month = match[1];
      const year = match[2].length === 4 ? match[2].substring(2) : match[2];
      result.expiryDate = `${month}/${year}`;
      break;
    }
  }

  // 有效期校验
  if (result.expiryDate) {
    result.expiryValidation = validateBankCardExpiry(result.expiryDate);
    result.isExpired = result.expiryValidation.isExpired;
  }

  // ========== 持卡人姓名提取 ==========
  const namePatterns = [
    /持卡人[：:]?\s*([^\s\d]{2,20})/i,
    /([A-Z]{2,}\s+[A-Z]+)/i, // 英文名
  ];

  for (const pattern of namePatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      result.holderName = match[1].trim();
      break;
    }
  }

  // ========== 有效证件验证 ==========

  // 1. 字段值验证
  const isValidCardNumber =
    result.cardNumber &&
    result.cardNumber.length >= 13 &&
    result.cardNumber.length <= 19 &&
    result.validation?.valid === true;

  // 有效期格式校验: MM/YY
  const isValidExpiry =
    result.expiryDate && /^(0[1-9]|1[0-2])\/\d{2}$/.test(result.expiryDate);

  // 有效期未过期
  const isNotExpired = !result.isExpired;

  // 2. 综合判断 - 严格模式：必须且仅需 卡号+有效期
  // 银行和卡类型是推导出来的，不参与校验
  const isValid = isValidCardNumber && isValidExpiry;

  result.valid = isValid;
  result.isValid = isValid;

  // 判定是否为银行卡 (只要卡号有效，或者有多个银行卡关键词)
  // 用于区分 "非银行卡" 和 "无效银行卡"
  result.isBankCard =
    isValidCardNumber || (result.cardNumber && result.cardNumber.length >= 10);

  // 3. 添加验证详情
  result.validationDetails = {
    fields: {
      isValidCardNumber,
      isValidExpiry,
      isNotExpired,
    },
    cardValidation: result.validation,
    expiryValidation: result.expiryValidation,
  };

  return result;
}

/**
 * 根据 BIN 码获取银行信息
 * @param {string} cardNumber - 银行卡号
 * @returns {Object|null} 银行信息
 */
export function getBankByBIN(cardNumber) {
  if (!cardNumber || cardNumber.length < 6) {
    return null;
  }

  // 优先匹配6位，然后5位，最后4位
  const prefixes = [
    cardNumber.substring(0, 6),
    cardNumber.substring(0, 5),
    cardNumber.substring(0, 4),
    cardNumber.substring(0, 3),
  ];

  for (const prefix of prefixes) {
    if (BANK_BIN_DATABASE[prefix]) {
      return BANK_BIN_DATABASE[prefix];
    }
  }

  // 根据前两位粗略判断
  const first2 = cardNumber.substring(0, 2);
  if (first2 === "62") {
    return { bank: "银联卡", type: "借记卡" };
  } else if (first2 === "60" || first2 === "65") {
    return { bank: "银联卡", type: "借记卡" };
  } else if (first2 >= "51" && first2 <= "55") {
    return { bank: "Mastercard", type: "贷记卡" };
  } else if (
    first2 === "40" ||
    first2 === "41" ||
    first2 === "42" ||
    first2 === "44" ||
    first2 === "45" ||
    first2 === "46" ||
    first2 === "47" ||
    first2 === "48" ||
    first2 === "49"
  ) {
    return { bank: "VISA", type: "贷记卡" };
  } else if (first2 === "34" || first2 === "37") {
    return { bank: "American Express", type: "贷记卡" };
  }

  return null;
}

/**
 * 获取银行卡类型
 * @param {string} cardNumber - 银行卡号
 * @returns {string} 卡类型
 */
export function getCardType(cardNumber) {
  const bankInfo = getBankByBIN(cardNumber);
  return bankInfo ? bankInfo.type : "未知";
}

export default {
  parseBankCard,
  getBankByBIN,
  getCardType,
  BANK_CARD_REGIONS,
};
