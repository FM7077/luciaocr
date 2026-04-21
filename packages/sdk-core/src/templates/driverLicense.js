/**
 * 驾驶证识别模板
 *
 * @author luciaocr
 * @version 1.0.0
 * @description 根据规范更新的校验规则
 */

import {
  validateDriverLicenseNumber,
  validateArchiveNumber,
  validateLicenseClass,
  validateDriverLicenseValidPeriod,
} from "../utils/validators.js";

/**
 * 驾驶证正页字段区域（相对比例）
 */
export const DRIVER_LICENSE_REGIONS = {
  licenseNumber: { x: 0.28, y: 0.18, width: 0.6, height: 0.08 },
  name: { x: 0.28, y: 0.28, width: 0.35, height: 0.08 },
  gender: { x: 0.65, y: 0.28, width: 0.1, height: 0.08 },
  nationality: { x: 0.28, y: 0.36, width: 0.2, height: 0.08 },
  address: { x: 0.28, y: 0.44, width: 0.5, height: 0.12 },
  birthDate: { x: 0.28, y: 0.56, width: 0.3, height: 0.08 },
  issueDate: { x: 0.28, y: 0.64, width: 0.3, height: 0.08 },
  licenseClass: { x: 0.28, y: 0.72, width: 0.3, height: 0.08 },
  validPeriod: { x: 0.28, y: 0.8, width: 0.55, height: 0.08 },
  photo: { x: 0.03, y: 0.25, width: 0.22, height: 0.45 },
};

/**
 * 准驾车型说明
 */
export const LICENSE_CLASS_DESC = {
  A1: "大型客车",
  A2: "牵引车",
  A3: "城市公交车",
  B1: "中型客车",
  B2: "大型货车",
  C1: "小型汽车",
  C2: "小型自动挡汽车",
  C3: "低速载货汽车",
  C4: "三轮汽车",
  C5: "残疾人专用小型自动挡载客汽车",
  D: "普通三轮摩托车",
  E: "普通二轮摩托车",
  F: "轻便摩托车",
  M: "轮式自行机械车",
  N: "无轨电车",
  P: "有轨电车",
};

/**
 * 驾驶证主页关键词
 */
const MAIN_PAGE_KEYWORDS = [
  "姓名",
  "性别",
  "国籍",
  "住址",
  "出生日期",
  "初次领证日期",
  "准驾车型",
  "有效期限",
  "证号",
];

/**
 * 驾驶证副页关键词
 */
const SUB_PAGE_KEYWORDS = ["证号", "姓名", "档案编号", "记录"];

/**
 * 判断是主页还是副页
 * 规则:
 * - 主页（正本）：包含照片及关键字 "姓名""国籍""地址""出生日期""初次领证日期""准驾车型""有效期限""证号"
 * - 副页：包含 "记分""实习期""档案编号"等记录栏
 *
 * @param {string} text - OCR 识别的原始文本
 * @returns {string} "main" | "sub" | "unknown"
 */
export function detectDriverLicensePage(text) {
  const cleanText = text.replace(/\s+/g, "");

  // 统计主页关键词命中数
  let mainCount = 0;
  for (const keyword of MAIN_PAGE_KEYWORDS) {
    if (cleanText.includes(keyword.replace(/\s+/g, ""))) {
      mainCount++;
    }
  }

  // 统计副页关键词命中数
  let subCount = 0;
  for (const keyword of SUB_PAGE_KEYWORDS) {
    if (cleanText.includes(keyword.replace(/\s+/g, ""))) {
      subCount++;
    }
  }

  // 如果包含"中华人民共和国机动车驾驶证"且没有"副页"字样，判断为主页
  if (
    cleanText.includes("中华人民共和国机动车驾驶证") &&
    !cleanText.includes("副页")
  ) {
    return "main";
  }

  // 如果明确包含"副页"，判断为副页
  if (cleanText.includes("副页")) {
    return "sub";
  }

  // 根据关键词命中数判断
  if (mainCount >= 5 && mainCount > subCount) {
    return "main";
  }

  if (subCount >= 1 && subCount >= mainCount) {
    return "sub";
  }

  return "unknown";
}

/**
 * 解析驾驶证主页信息
 * @param {Array} lines - OCR 识别的行列表
 * @returns {Object} 解析后的驾驶证信息
 */
export function parseDriverLicense(text, lines = []) {
  const result = {
    licenseNumber: "", // 证号（12位数字）
    name: "", // 姓名
    gender: "", // 性别
    nationality: "中国", // 国籍
    address: "", // 住址
    birthDate: "", // 出生日期
    firstIssueDate: "", // 初次领证日期
    licenseClass: "", // 准驾车型
    licenseClassDesc: "", // 准驾车型描述
    validPeriod: {
      // 有效期限
      start: "",
      end: "",
    },
    issueAuthority: "", // 发证机关
    valid: false,
    isValid: false,
    isExpired: false,
    page: "main",
    validation: null,
    validationDetails: {},
  };

  // 清理文本
  const cleanText = text.replace(/\s+/g, " ").trim();
  const noSpaceText = text.replace(/\s+/g, "");

  // ========== 字段提取 ==========

  // 1. 证号提取（通常为18位身份证号，旧版可能15位）
  // 优化：使用无空格文本搜索，防止 OCR 产生的空格中断号码识别
  // 匹配 15-19 位数字 (兼容可能的OCR误读或非法字符混入)
  const licenseNumberMatch = noSpaceText.match(/(?<!\d)\d{15,19}(?!\d)/);
  if (licenseNumberMatch) {
    result.licenseNumber = licenseNumberMatch[0];
    // result.validation = validateDriverLicenseNumber(result.licenseNumber); // 暂时移除专用校验，使用通用长度校验
  }

  // 2. 姓名提取
  const namePatterns = [
    /姓\s*名\s*[：:]?\s*([^\s\d]{2,10})/i,
    /(?:姓名|NAME)\s*[：:]?\s*([^\s]{2,10})/i,
  ];
  for (const pattern of namePatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      result.name = match[1].replace(/[性别国籍住址]/g, "").replace(/\s+/g, "");
      if (result.name.length >= 2) break;
    }
  }

  // 3. 性别提取
  const genderPatterns = [
    /性\s*别\s*[：:]?\s*(男|女)/i,
    /(?:SEX)\s*[：:]?\s*([MF男女])/i,
  ];
  for (const pattern of genderPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const g = match[1].toUpperCase();
      result.gender = g === "M" || g === "男" ? "男" : "女";
      break;
    }
  }

  // 4. 国籍提取
  const nationalityPatterns = [
    /国\s*籍\s*[：:]?\s*([^\s]{2,10})/i,
    /(?:NATIONALITY)\s*[：:]?\s*([A-Za-z\u4e00-\u9fa5]+)/i,
  ];
  for (const pattern of nationalityPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      result.nationality = match[1].replace(/住址|地址/g, "").trim();
      if (result.nationality) break;
    }
  }

  // 5. 住址提取
  const addressPatterns = [
    /住\s*址\s*[：:]?\s*(.+?)(?=出生日期|初次|准驾|有效|$)/is,
    /(?:ADDRESS)\s*[：:]?\s*(.+?)(?=出生|初次|准驾|有效|$)/is,
  ];
  for (const pattern of addressPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      result.address = match[1]
        .replace(/\s+/g, "")
        .replace(/出生日期.*$/, "")
        .replace(/\d{12}/, "") // 排除证号
        .trim();
      if (result.address.length > 5 && !/\d{8,}/.test(result.address)) break;
    }
  }

  // 6. 出生日期提取
  const birthPatterns = [
    /出\s*生\s*日\s*期\s*[：:]?\s*(\d{4})[年.\-/](\d{1,2})[月.\-/](\d{1,2})/i,
    /(?:BIRTH)\s*[：:]?\s*(\d{4})[.\-/](\d{2})[.\-/](\d{2})/i,
    /(\d{4})\.(\d{2})\.(\d{2})/,
  ];
  for (const pattern of birthPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.birthDate = `${match[1]}-${match[2].padStart(
        2,
        "0"
      )}-${match[3].padStart(2, "0")}`;
      break;
    }
  }

  // 7. 初次领证日期提取
  const issueDatePatterns = [
    /初\s*次\s*领\s*证\s*日\s*期\s*[：:,]?\s*(\d{4})[年.\-/](\d{1,2})[月.\-/](\d{1,2})/i,
    /(?:ISSUE\s*DATE)\s*[：:]?\s*(\d{4})[.\-/](\d{2})[.\-/](\d{2})/i,
    // 宽松模式：仅仅匹配日期格式，且前文有"领证"
    /领\s*证.*(\d{4})[\-.](\d{2})[\-.](\d{2})/,
  ];
  for (const pattern of issueDatePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.firstIssueDate = `${match[1]}-${match[2].padStart(
        2,
        "0"
      )}-${match[3].padStart(2, "0")}`;
      break;
    }
  }

  // 8. 准驾车型提取
  const classPatterns = [
    /准\s*驾\s*车\s*型\s*[：:]?\s*([A-Z][\d]?(?:[A-Z][\d]?)*)/i,
    /(?:CLASS)\s*[：:]?\s*([A-Z][\d]?(?:[A-Z][\d]?)*)/i,
  ];
  for (const pattern of classPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.licenseClass = match[1].toUpperCase();
      break;
    }
  }

  // 验证准驾车型并获取描述
  if (result.licenseClass) {
    const classValidation = validateLicenseClass(result.licenseClass);
    if (classValidation.valid) {
      result.licenseClassDesc = classValidation.description;
    }
  }

  // 9. 有效期限提取
  const validPatterns = [
    /有\s*效\s*(?:期\s*限|起\s*始\s*日\s*期)\s*[：:]?\s*(\d{4})[年.\-/](\d{1,2})[月.\-/](\d{1,2})\s*[至到\-—]\s*(\d{4})[年.\-/](\d{1,2})[月.\-/](\d{1,2})/i,
    /有\s*效\s*(?:期\s*限|起\s*始\s*日\s*期)\s*[：:]?\s*(\d{4})[年.\-/](\d{1,2})[月.\-/](\d{1,2})\s*[至到\-—]\s*(长期)/i,
    /(\d{4})[.\-/](\d{2})[.\-/](\d{2})\s*[至到—\-]\s*(\d{4})[.\-/](\d{2})[.\-/](\d{2})/,
    /(\d{4})[.\-/](\d{2})[.\-/](\d{2})\s*[至到—\-]\s*(长期)/,
  ];
  for (const pattern of validPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.validPeriod.start = `${match[1]}.${match[2].padStart(
        2,
        "0"
      )}.${match[3].padStart(2, "0")}`;
      if (match[4] === "长期") {
        result.validPeriod.end = "长期";
      } else {
        result.validPeriod.end = `${match[4]}.${match[5].padStart(
          2,
          "0"
        )}.${match[6].padStart(2, "0")}`;
      }
      break;
    }
  }

  // 发证机关提取
  const authorityPatterns = [
    /(?:发证机关|签发机关)\s*[：:]?\s*(.+?公安局[^\s]*)/i,
    /(.+?公安局.+?支队)/i,
  ];
  for (const pattern of authorityPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      result.issueAuthority = match[1].replace(/\s+/g, "").trim();
      break;
    }
  }

  // ========== 智能行匹配 (Intelligent Line Parsing) ==========
  if (lines && lines.length > 0) {
    // 1. 姓名智能匹配
    if (!result.name || result.name.length < 2) {
      for (let i = 0; i < Math.min(lines.length, 5); i++) {
        let line = lines[i].trim();
        // 清理可能的关键词（支持带有空格的关键词）及剩余空格
        line = line
          .replace(/姓\s*名/g, "")
          .replace(/[:：]/g, "")
          .replace(/\s+/g, "");

        if (
          /^[\u4e00-\u9fa5]{2,10}$/.test(line) &&
          !/性别|国籍|出生|住址|证号|准驾|有效/.test(line)
        ) {
          result.name = line;
          break;
        }
      }
    }
    // 2. 准驾车型智能匹配
    if (!result.licenseClass) {
      for (const line of lines) {
        const match = line.match(/\b([A-Z][0-9]?)\b/);
        if (match) {
          const code = match[1];
          if (LICENSE_CLASS_DESC[code]) {
            result.licenseClass = code;
            result.licenseClassDesc = LICENSE_CLASS_DESC[code];
            break;
          }
        }
      }
    }
    // 3. 住址智能匹配
    if (!result.address || result.address.length < 5) {
      let addressFound = false;
      let addressLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim().replace(/\s+/g, "");
        if (/省|市|区|县/.test(line) && !/出生|国籍/.test(line)) {
          addressFound = true;
        }
        if (addressFound) {
          if (/\d{12,}/.test(line) || /证号/.test(line) || /有效/.test(line))
            break;
          if (!/住址|地址/.test(line)) addressLines.push(line);
        }
      }
      if (addressLines.length > 0) result.address = addressLines.join("");
    }
  }

  // ========== 有效证件验证 ==========

  // 1. 关键词检测
  const hasMainTitleKeyword = /中华人民共和国机动车驾驶证/.test(text);
  const hasLicenseNumberKeyword = /证\s*号/.test(text) || /\d{12}/.test(text); // 包含12位数字即视为命中
  const hasNameKeyword = /姓\s*名/.test(text);
  const hasGenderKeyword = /性\s*别/.test(text);
  const hasNationalityKeyword = /国\s*籍/.test(text);
  const hasAddressKeyword = /住\s*址/.test(text);
  const hasBirthKeyword = /出生日期/.test(text);
  const hasIssueDateKeyword = /初次领证/.test(text);
  const hasClassKeyword = /准驾车型/.test(text);
  const hasValidPeriodKeyword = /有效期限/.test(text);

  // 必须包含至少 4 个特征词 (大幅降低阈值)
  const keywordCount = [
    hasMainTitleKeyword,
    hasLicenseNumberKeyword,
    hasNameKeyword,
    hasGenderKeyword,
    hasNationalityKeyword,
    hasAddressKeyword,
    hasBirthKeyword,
    hasIssueDateKeyword,
    hasClassKeyword,
    hasValidPeriodKeyword,
  ].filter(Boolean).length;

  const hasAllKeywords = keywordCount >= 4;

  // 2. 字段值验证
  const isValidLicenseNumber =
    (!!result.licenseNumber && result.licenseNumber.length === 18) ||
    result.licenseNumber.length === 15; // 身份证号通常作为证号

  const isValidName =
    result.name && result.name.length >= 2 && result.name.length <= 10;

  const isValidGender = result.gender === "男" || result.gender === "女";

  const isValidNationality =
    result.nationality && result.nationality.length >= 2; // Fixed: Added implementation

  const isValidAddress =
    result.address &&
    result.address.length >= 8 &&
    /省|市|县|区/.test(result.address);

  // Define missing validation variables
  const isValidBirthDate = !!result.birthDate;
  const isValidIssueDate = !!result.issueDate;
  const isValidClass = !!result.licenseClass;
  const isValidPeriod = !!result.validPeriod && !!result.validPeriod.end;
  const periodValidation = checkLicenseValidity(result);

  // 3. 综合判断 - 严格模式：核心字段 valid 且 关键词齐全
  // 必须满足：证号有效 && 姓名有效 && (关键词 >= 8) -> 接近 "All Keywords"
  const isValid =
    isValidLicenseNumber &&
    isValidName &&
    isValidGender &&
    (hasAllKeywords || keywordCount >= 8);

  result.valid = isValid;
  result.isValid = isValid;

  // 判定是否为驾驶证 (区分 "非驾驶证" 和 "无效驾驶证")
  result.isDriverLicense = hasMainTitleKeyword || keywordCount >= 3;

  // 4. 添加验证详情
  result.validationDetails = {
    keywords: {
      hasMainTitleKeyword,
      hasLicenseNumberKeyword,
      hasNameKeyword,
      hasGenderKeyword,
      hasNationalityKeyword,
      hasAddressKeyword,
      hasBirthKeyword,
      hasIssueDateKeyword,
      hasClassKeyword,
      hasValidPeriodKeyword,
      keywordCount,
      hasAllKeywords,
    },
    fields: {
      isValidLicenseNumber,
      isValidName,
      isValidGender,
      isValidNationality,
      isValidAddress,
      isValidBirthDate,
      isValidIssueDate,
      isValidClass,
      isValidPeriod,
    },
    periodValidation,
  };

  return result;
}

/**
 * 解析驾驶证副页信息
 * @param {Array} lines - OCR 识别的行列表
 * @returns {Object} 解析后的驾驶证副页信息
 */
export function parseDriverLicenseSubPage(text, lines = []) {
  const result = {
    licenseNumber: "", // 证号
    name: "", // 姓名
    archiveNumber: "", // 档案编号（12位纯数字）
    record: "", // 记录
    valid: false,
    isValid: false,
    page: "sub",
    isDriverLicense: false,
    validation: null,
    validationDetails: {},
  };

  // 清理文本
  const cleanText = text.replace(/\s+/g, " ").trim();

  // ========== 智能行匹配 (Intelligent Line Parsing) ==========
  if (lines && lines.length > 0) {
    // 1. 档案编号智能匹配 (12位纯数字)
    if (!result.archiveNumber) {
      for (const line of lines) {
        const match = line.match(/\b\d{12}\b/);
        if (match) {
          result.archiveNumber = match[0];
          result.validation = validateArchiveNumber(result.archiveNumber);
          break;
        }
      }
    }
    // 2. 记录智能匹配 (包含 "记录" 或 相关关键词)
    if (!result.record) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // 情况A: 明确包含 "记录"
        if (line.includes("记录")) {
          // 提取 "记录" 及其后的内容，或者该行就是标题，下一行是内容
          const content = line.replace(/^.*?记录[:：]?\s*/, "");
          if (content.length > 2) {
            result.record = content;
          } else if (lines[i + 1]) {
            result.record = lines[i + 1].trim();
          }
          break;
        }
        // 情况B: 包含常见的记录关键词 (实习, 有效, 延长, 增驾)
        if (/实习|延长|大清|恢复|增驾/.test(line)) {
          result.record = line;
          break;
        }
      }
    }

    // 3. 姓名智能匹配 (副页可能没有"姓名"标签，但有些有，或者名字独立一行)
    if (!result.name) {
      for (const line of lines) {
        // 清理行内容，移除空格以便匹配标签
        let cleanLine = line.trim().replace(/\s+/g, "");
        // 匹配 "姓名: xxx"
        if (/^姓名|Name/i.test(cleanLine)) {
          // 移除标签和标点，提取名字
          let nameCandidate = cleanLine.replace(/姓名|Name|[:：]/gi, "");
          // 简单验证：2-10位非数字
          if (
            nameCandidate.length >= 2 &&
            nameCandidate.length <= 10 &&
            !/\d/.test(nameCandidate)
          ) {
            result.name = nameCandidate.replace(/[档案编号记录]/g, "");
            break;
          }
        }
      }
    }
  }

  // ========== 字段提取 (Regex Fallback) ==========

  // 证号提取 (通常为18位身份证号，但也可能ocr为12位)
  if (!result.licenseNumber) {
    const licensePatterns = [
      /证\s*号\s*[：:]?\s*(\d{15,19})/i,
      /(?:^|\s)(\d{18})(?:\s|$)/,
    ];
    for (const pattern of licensePatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        result.licenseNumber = match[1];
        break;
      }
    }
  }

  // 档案编号提取
  if (!result.archiveNumber) {
    const archivePatterns = [
      /档\s*案\s*编\s*号\s*[：:]?\s*(\d{12})/i,
      /档案编号\s*[：:]?\s*(\d{12})/i,
    ];
    for (const pattern of archivePatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        result.archiveNumber = match[1].trim();
        result.validation = validateArchiveNumber(result.archiveNumber);
        break;
      }
    }
  }

  // 记录提取 (Regex Fallback)
  if (!result.record) {
    const recordPatterns = [
      /记\s*录\s*[：:]?\s*([\s\S]+?)(?=备注|$)/i,
      /记录\s*[：:]?\s*(无|有)/i,
    ];
    for (const pattern of recordPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        result.record = match[1].trim();
        break;
      }
    }
  }

  // 姓名提取 (Regex Fallback)
  if (!result.name) {
    // 宽松模式：允许姓名中间有空格，匹配后去除
    const namePatterns = [/姓\s*名\s*[：:]?\s*([^\d:：]{2,20})/i];
    for (const pattern of namePatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        result.name = match[1].replace(/[档案编号记录\s]/g, "").trim();
        if (result.name.length >= 2 && result.name.length <= 10) break;
      }
    }
  }

  // ========== 有效证件验证 ==========

  // 1. 关键词检测
  const hasSubPageTitleKeyword =
    /中华人民共和国机动车驾驶证副页/.test(text) || /副页/.test(text);
  const hasLicenseNumberKeyword =
    /证\s*号/.test(text) || /\d{15,19}/.test(text);
  const hasArchiveKeyword =
    /档\s*案\s*编\s*号/.test(text) || /\d{12}/.test(text);
  const hasRecordKeyword = /记\s*录/.test(text);

  // 核心特征计数
  const keywordCount = [
    hasSubPageTitleKeyword,
    hasLicenseNumberKeyword,
    hasArchiveKeyword,
    hasRecordKeyword,
  ].filter(Boolean).length;

  // 2. 字段值验证
  const isValidLicenseNumber =
    !!result.licenseNumber && result.licenseNumber.length >= 15;

  const isValidArchiveNumber =
    !!result.archiveNumber && result.archiveNumber.length === 12;

  // 3. 综合判断 (Strict Validation)
  // 如果是副页，必须要有 证号、档案编号、姓名、记录 才能算有效
  const isValid =
    isValidLicenseNumber &&
    isValidArchiveNumber &&
    !!result.name &&
    !!result.record;

  result.valid = isValid;
  result.isValid = isValid;

  // 判定是否为驾驶证副页 (宽松判定，用于UI展示 'Invalid Driver License' 而不是 'Not a Card')
  result.isDriverLicense =
    hasSubPageTitleKeyword || (hasArchiveKeyword && keywordCount >= 4);

  // 4. 添加验证详情
  result.validationDetails = {
    keywords: {
      hasSubPageTitleKeyword,
      hasLicenseNumberKeyword,
      hasArchiveKeyword,
      hasRecordKeyword,
      keywordCount,
    },
    fields: {
      isValidLicenseNumber,
      isValidArchiveNumber,
    },
  };

  return result;
}

/**
 * 智能解析驾驶证（自动判断主副页）
 * @param {Array} lines - OCR 识别的行列表
 * @returns {Object} 解析结果
 */
export function parseDriverLicenseAuto(text, lines = []) {
  // 预处理：移除空格以便关键词检测
  const noSpaceText = text.replace(/\s+/g, "");

  // 强规则：如果包含 "副页"，直接强制走副页解析
  if (noSpaceText.includes("副页")) {
    return parseDriverLicenseSubPage(text, lines);
  }

  const page = detectDriverLicensePage(text);

  if (page === "main") {
    return parseDriverLicense(text, lines);
  } else if (page === "sub") {
    return parseDriverLicenseSubPage(text, lines);
  } else {
    // 无法判断时，尝试两种解析，返回置信度更高的
    const mainResult = parseDriverLicense(text, lines);
    const subResult = parseDriverLicenseSubPage(text, lines);

    // 计算分数时，排除默认值 (如 Nationality="中国") 的干扰
    const mainScore = Object.keys(mainResult).filter(
      (k) =>
        k !== "page" &&
        k !== "nationality" &&
        mainResult[k] &&
        mainResult[k] !== "中国"
    ).length;

    const subScore = Object.keys(subResult).filter(
      (k) => k !== "page" && subResult[k]
    ).length;

    if (mainScore >= subScore) {
      return mainResult;
    } else {
      return subResult;
    }
  }
}

/**
 * 检查驾驶证是否有效
 * @param {Object} license - 驾驶证信息
 * @returns {Object} 有效性检查结果
 */
export function checkLicenseValidity(license) {
  const result = {
    isValid: false,
    isExpired: false,
    daysUntilExpiry: null,
    message: "",
  };

  if (!license.validPeriod || !license.validPeriod.end) {
    result.message = "无法确定有效期";
    return result;
  }

  if (license.validPeriod.end === "长期") {
    result.isValid = true;
    result.message = "长期有效";
    return result;
  }

  const endDate = new Date(license.validPeriod.end.replace(/\./g, "-"));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  result.daysUntilExpiry = diffDays;

  if (diffDays < 0) {
    result.isExpired = true;
    result.message = `驾驶证已过期 ${Math.abs(diffDays)} 天`;
  } else if (diffDays <= 90) {
    result.isValid = true;
    result.message = `驾驶证将在 ${diffDays} 天后过期，请及时换证`;
  } else {
    result.isValid = true;
    result.message = `驾驶证有效，距过期还有 ${diffDays} 天`;
  }

  return result;
}

/**
 * 获取准驾车型描述
 * @param {string} licenseClass - 准驾车型代码
 * @returns {string} 描述
 */
export function getLicenseClassDescription(licenseClass) {
  return LICENSE_CLASS_DESC[licenseClass] || "未知车型";
}

export default {
  detectDriverLicensePage,
  parseDriverLicenseAuto,
  parseDriverLicense,
  parseDriverLicenseSubPage,
  checkLicenseValidity,
  getLicenseClassDescription,
  DRIVER_LICENSE_REGIONS,
  LICENSE_CLASS_DESC,
};
