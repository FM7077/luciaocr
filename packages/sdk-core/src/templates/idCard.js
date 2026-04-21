/**
 * 身份证识别模板
 *
 * @author luciaocr
 * @version 1.0.0
 * @description 根据规范更新的校验规则
 */

import {
  validateIdCard,
  formatIdCard,
  validateIdCardValidPeriod,
} from "../utils/validators.js";

/**
 * 身份证正面字段区域（相对比例）
 * 用于区域裁剪识别以提升精度
 */
export const ID_CARD_FRONT_REGIONS = {
  name: { x: 0.18, y: 0.08, width: 0.35, height: 0.12 },
  gender: { x: 0.18, y: 0.2, width: 0.08, height: 0.1 },
  ethnicity: { x: 0.35, y: 0.2, width: 0.15, height: 0.1 },
  birthDate: { x: 0.18, y: 0.32, width: 0.4, height: 0.1 },
  address: { x: 0.18, y: 0.44, width: 0.5, height: 0.25 },
  photo: { x: 0.72, y: 0.08, width: 0.24, height: 0.6 },
};

/**
 * 身份证背面字段区域（相对比例）
 */
export const ID_CARD_BACK_REGIONS = {
  authority: { x: 0.22, y: 0.6, width: 0.6, height: 0.15 },
  validPeriod: { x: 0.22, y: 0.78, width: 0.65, height: 0.12 },
  idNumber: { x: 0.32, y: 0.85, width: 0.65, height: 0.12 },
};

/**
 * 身份证正面关键词
 */
const FRONT_KEYWORDS = ["姓名", "性别", "民族", "出生", "住址", "公民身份号码"];

/**
 * 身份证背面关键词
 */
const BACK_KEYWORDS = ["签发机关", "有效期限"];

/**
 * 判断是正面还是背面
 * 规则:
 * - 正面（人像面）：包含 "姓名""性别""民族""出生""住址""公民身份号码"
 * - 背面（国徽面）：包含 "签发机关""有效期限"
 * - 若同时出现正面和背面关键字，优先以"公民身份号码"所在面判断为正面
 *
 * @param {string} text - OCR 识别的原始文本
 * @returns {string} "front" | "back" | "unknown"
 */
export function detectIdCardSide(text) {
  const cleanText = text.replace(/\s+/g, "");

  // 统计正面关键词命中数
  let frontCount = 0;
  for (const keyword of FRONT_KEYWORDS) {
    if (cleanText.includes(keyword.replace(/\s+/g, ""))) {
      frontCount++;
    }
  }

  // 统计背面关键词命中数
  let backCount = 0;
  for (const keyword of BACK_KEYWORDS) {
    if (cleanText.includes(keyword.replace(/\s+/g, ""))) {
      backCount++;
    }
  }

  // 如果包含"公民身份号码"，优先判断为正面
  if (
    cleanText.includes("公民身份号码") ||
    cleanText.includes("公民身份证号码")
  ) {
    return "front";
  }

  // 根据关键词命中数判断
  if (frontCount >= 3 && frontCount > backCount) {
    return "front";
  }

  if (backCount >= 1 && backCount > frontCount) {
    return "back";
  }

  // 如果同时有较多关键词，再次检查是否有身份证号码格式（18位）
  const has18DigitId = /\d{6}(19|20)\d{9}[\dXx]/.test(text);
  if (has18DigitId && frontCount > 0) {
    return "front";
  }

  return "unknown";
}

const ALL_ETHNICITIES = [
  "汉",
  "蒙古",
  "回",
  "藏",
  "维吾尔",
  "苗",
  "彝",
  "壮",
  "布依",
  "朝鲜",
  "满",
  "侗",
  "瑶",
  "白",
  "土家",
  "哈尼",
  "哈萨克",
  "傣",
  "黎",
  "傈僳",
  "佤",
  "畲",
  "高山",
  "拉祜",
  "水",
  "东乡",
  "纳西",
  "景颇",
  "柯尔克孜",
  "土",
  "达斡尔",
  "仫佬",
  "羌",
  "布朗",
  "撒拉",
  "毛南",
  "仡佬",
  "锡伯",
  "阿昌",
  "普米",
  "塔吉克",
  "怒",
  "乌孜别克",
  "俄罗斯",
  "鄂温克",
  "德昂",
  "保安",
  "裕固",
  "京",
  "塔塔尔",
  "独龙",
  "鄂伦春",
  "赫哲",
  "门巴",
  "珞巴",
  "基诺",
];

/**
 * 解析身份证正面信息
 * @param {string} text - OCR 识别的原始文本
 * @param {Array} lines - OCR 识别的行列表 (新增)
 * @returns {Object} 解析后的身份证信息
 */
export function parseIdCardFront(text, lines = []) {
  const result = {
    name: "",
    gender: "",
    ethnicity: "",
    birthDate: "",
    address: "",
    idNumber: "",
    valid: false,
    isValid: false,
    side: "front",
    validationDetails: {},
  };

  // 清理文本
  const cleanText = text.replace(/\s+/g, " ").trim();
  const noSpaceText = text.replace(/\s+/g, "");

  // ========== 字段提取 ==========

  // 1. 公民身份号码提取（最优先，具有强特征）
  // 优化：使用无空格文本进行搜索，避免OCR产生的空格干扰
  const idNumberMatch =
    noSpaceText.match(/(?<!\d)\d{17}[\dXx](?!\d)/) ||
    noSpaceText.match(/(?<!\d)\d{6}(19|20)\d{9}[\dXx](?!\d)/);

  if (idNumberMatch) {
    result.idNumber = idNumberMatch[0].toUpperCase();
  }

  // 2. 姓名提取
  // 策略A: 关键词匹配
  const namePatterns = [
    /姓\s*名\s*[：:]\s*([^\s\d]+)/,
    /姓\s*名\s+([^\s\d]+)/, // 增加：支持没有冒号但有空格的情况 "姓 名 樊天成"
    /姓名\s*([^\s\d]+)/,
    /^([^\s]{2,4})(?=\s*性别)/m,
  ];
  for (const pattern of namePatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      // 提取后清理
      let name = match[1]
        .replace(/[性别民族出生住址]/g, "")
        .replace(/\s+/g, "");
      // 长度限制放宽到 2-15 位
      if (name.length >= 2 && name.length <= 15) {
        result.name = name;
        break;
      }
    }
  }

  // 策略B: 利用性别定位 (姓名通常在性别之前)
  if (!result.name) {
    const genderIndex = cleanText.search(/性\s*别|男|女/);
    if (genderIndex > 2) {
      // 获取性别前的一段文本
      const possibleName = cleanText
        .substring(Math.max(0, genderIndex - 15), genderIndex)
        .split(/\s+/)
        .pop(); // 取最后一段

      if (
        possibleName &&
        /[\u4e00-\u9fa5]{2,10}(?:·[\u4e00-\u9fa5]{2,10})*$/.test(possibleName)
      ) {
        result.name = possibleName.match(
          /[\u4e00-\u9fa5]{2,10}(?:·[\u4e00-\u9fa5]{2,10})*$/
        )[0];
      }
    }
  }

  // 3. 性别提取
  const genderPatterns = [/性\s*别\s*[：:]?\s*(男|女)/, /(男|女)\s*民族/];
  for (const pattern of genderPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.gender = match[1];
      break;
    }
  }
  // 假如没提取到，但身份证号提取到了，从身份证号获取
  if (!result.gender && result.idNumber) {
    const genderCode = parseInt(result.idNumber.charAt(16));
    result.gender = genderCode % 2 === 1 ? "男" : "女";
  }

  // 4. 民族提取
  const ethnicityPatterns = [
    /民\s*族\s*[：:]?\s*([^\s]+?)(?:族|$)/,
    /(?:男|女)\s*([^\s]+?)族/,
  ];
  for (const pattern of ethnicityPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      const ethnicity = match[1].replace(/族$/, "");
      if (ethnicity.length <= 10) {
        result.ethnicity = ethnicity + "族";
        break;
      }
    }
  }

  // 5. 出生日期提取
  const birthPatterns = [
    /(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/,
    /出\s*生\s*[：:]?\s*(\d{4})[年.\-/](\d{1,2})[月.\-/](\d{1,2})/,
    /(\d{4})\.(\d{1,2})\.(\d{1,2})/,
  ];
  for (const pattern of birthPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, "0");
      const day = match[3].padStart(2, "0");
      result.birthDate = `${year}年${month}月${day}日`;
      break;
    }
  }
  // 假如没提取到，从身份证号获取
  if (!result.birthDate && result.idNumber) {
    const year = result.idNumber.substring(6, 10);
    const month = result.idNumber.substring(10, 12);
    const day = result.idNumber.substring(12, 14);
    result.birthDate = `${year}年${month}月${day}日`;
  }

  // 6. 住址提取
  // 优化：排除类似身份证号的长数字，要求必须包含省市县等关键字
  const addressPatterns = [
    /住\s*址\s*[：:]?\s*(.+?)(?=公民身份|身份证|$)/is,
    /住址\s*(.+?)(?=\d{17}|$)/is,
  ];
  for (const pattern of addressPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      let candidate = match[1]
        .replace(/\s+/g, "")
        .replace(/公民身份.*$/, "")
        .trim();

      // 过滤干扰：仅当包含连续15位以上数字时才认为是误识别的号码
      if (!/\d{15,}/.test(candidate)) {
        result.address = candidate;
        // 如果包含省市区更佳，但为了兼容性暂不强制
        if (result.address.length > 5) break;
      }
    }
  }

  // ========== 智能行匹配 (Intelligent Line Parsing) ==========
  // 如果正则提取失败，尝试利用行结构和字典进行匹配
  if (lines && lines.length > 0) {
    // 1. 姓名智能匹配
    // 优先级1: 寻找明确包含 "姓名" 的行
    if (!result.name) {
      for (const line of lines) {
        if (/姓\s*名/.test(line)) {
          let nameCandidate = line
            .replace(/姓\s*名/g, "")
            .replace(/[:：]/g, "")
            .replace(/\s+/g, "");
          if (
            /^[\u4e00-\u9fa5]{2,15}(?:·[\u4e00-\u9fa5]{2,15})*$/.test(
              nameCandidate
            )
          ) {
            result.name = nameCandidate;
            break;
          }
        }
      }
    }

    // 优先级2: 如果没找到关键词，再尝试盲猜 (加上严格的黑名单和长度限制)
    if (!result.name || result.name.length < 2) {
      for (let i = 0; i < Math.min(lines.length, 7); i++) {
        let line = lines[i].trim();

        // 黑名单：水印文字常用词
        if (/仅供|办理|使用|租房|他用|复印|无效/.test(line)) continue;

        // 再次清理可能的残留
        line = line
          .replace(/姓\s*名/g, "")
          .replace(/[:：]/g, "")
          .replace(/\s+/g, "");

        // 规则: 无关键词行，长度严格限制为 2-4 个字 (太长容易误判)
        if (
          /^[\u4e00-\u9fa5]{2,4}$/.test(line) &&
          !/性别|民族|出生|住址|公民|身份|号码/.test(line)
        ) {
          result.name = line;
          break;
        }
      }
    }

    // 2. 民族智能匹配
    if (!result.ethnicity) {
      for (const line of lines) {
        const cleanLine = line.replace(/\s+/g, "");
        // 遍历所有民族
        for (const eth of ALL_ETHNICITIES) {
          // 如果行包含某个民族名称
          if (cleanLine.includes(eth)) {
            // 排除掉仅仅是 "民族" 两个字的情况 (防止死循环或误判)
            // 确保提取的是民族字本身，比如 "汉"，而不是 "民族"
            if (eth === "民族") continue;

            // 简单的包含判断往往足够，因为民族字通常比较独特
            // 除非是 '土' 这种容易混淆的，需要额外判断
            if (eth === "土" && cleanLine.includes("土地")) continue;

            result.ethnicity = eth + "族";
            break;
          }
        }
        if (result.ethnicity) break;
      }
    }

    // 3. 住址智能匹配
    if (!result.address || result.address.length < 5) {
      let addressFound = false;
      let addressLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim().replace(/\s+/g, "");

        // 遇到关键词开始收集
        if (/省|市|自治区|自治州|盟|县|区/.test(line)) {
          // 排除掉可能是出生日期的行 (例如 xxxx年x月x日)
          if (!/出生|生日/.test(line)) {
            addressFound = true;
          }
        }

        if (addressFound) {
          // 遇到身份证号停止
          if (
            /\d{15,}/.test(line) ||
            /公民身份/.test(line) ||
            /号码/.test(line)
          ) {
            break;
          }
          // 遇到"签发机关"或"有效期限"也停止 (防止错读背面)
          if (/签发|有效/.test(line)) break;

          // 排除关键词本身行 (如果该行只有关键词) - 但通常关键词和内容混合
          // 我们去掉行内的 "住址" "地址" 标签
          const content = line.replace(/住\s*址|地\s*址/g, "");
          if (content.length > 0) {
            addressLines.push(content);
          }
        }
      }

      if (addressLines.length > 0) {
        // 简单的拼接
        result.address = addressLines.join("");
        // 去掉开头可能的非地址字符
        result.address = result.address.replace(/^[^\u4e00-\u9fa5]+/, "");
      }
    }
  }

  // ========== 有效证件验证 ==========

  // 1. 关键词检测
  const hasNameKeyword = /姓\s*名/.test(text);
  const hasGenderKeyword = /性\s*别/.test(text);
  const hasEthnicityKeyword = /民\s*族/.test(text);
  const hasBirthKeyword = /出\s*生/.test(text);
  const hasAddressKeyword = /住\s*址/.test(text);
  const hasIdNumberKeyword =
    /公民身份(证)?号(码)?/.test(text) || /\d{17}[\dXx]/.test(text);

  const keywordCount = [
    hasNameKeyword,
    hasGenderKeyword,
    hasEthnicityKeyword,
    hasBirthKeyword,
    hasAddressKeyword,
    hasIdNumberKeyword,
  ].filter(Boolean).length;

  const hasAllKeywords = keywordCount >= 6; // 严格模式：必须包含所有6个关键特征

  // 2. 字段值验证
  const isValidName =
    result.name && result.name.length >= 2 && result.name.length <= 10; // 放宽名字长度限制

  const isValidGender = result.gender === "男" || result.gender === "女";

  const isValidEthnicity =
    result.ethnicity && /^[\u4e00-\u9fa5]{1,10}族$/.test(result.ethnicity);

  const isValidBirthDate = !!result.birthDate;

  const isValidAddress =
    result.address &&
    result.address.length >= 8 && // 放宽
    !/\d{10,}/.test(result.address); // 再次确保没有长数字

  // 身份证号使用校验函数验证
  let idValidation = null;
  let isValidIdNumber = false;
  if (result.idNumber) {
    idValidation = validateIdCard(result.idNumber);
    isValidIdNumber = idValidation.valid;
  }

  // 3. 综合判断
  const isValid =
    hasAllKeywords &&
    isValidName &&
    isValidGender &&
    isValidEthnicity &&
    isValidBirthDate &&
    isValidAddress &&
    isValidIdNumber;

  result.valid = isValid;
  result.isValid = isValid;

  // 4. 添加验证详情
  result.validationDetails = {
    keywords: {
      hasNameKeyword,
      hasGenderKeyword,
      hasEthnicityKeyword,
      hasBirthKeyword,
      hasAddressKeyword,
      hasIdNumberKeyword,
      keywordCount,
      hasAllKeywords,
    },
    fields: {
      isValidName,
      isValidGender,
      isValidEthnicity,
      isValidBirthDate,
      isValidAddress,
      isValidIdNumber,
    },
    idValidation,
  };

  // 严格判定：是否为身份证
  // 必须具备：身份证相关关键词 OR 18位身份证号
  result.isIdCard = hasIdNumberKeyword || keywordCount >= 3;

  return result;
}

/**
 * 解析身份证背面信息
 * @param {string} text - OCR 识别的原始文本
 * @returns {Object} 解析后的身份证背面信息
 */
export function parseIdCardBack(text, lines = []) {
  const result = {
    idNumber: "",
    authority: "",
    validPeriod: {
      start: "",
      end: "",
    },
    valid: false,
    isValid: false,
    isExpired: false,
    side: "back",
    validation: null,
    validationDetails: {},
  };

  // 清理文本
  const cleanText = text.replace(/\s+/g, " ").trim();

  // ========== 字段提取 ==========

  // 身份证号提取 (18位) - 背面也可能显示
  const idPatterns = [
    /(\d{6}(?:19|20)\d{9}[\dXx])/,
    /公民身份号码\s*[：:]?\s*(\d{17}[\dXx])/i,
  ];
  for (const pattern of idPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.idNumber = match[1].toUpperCase();
      result.validation = validateIdCard(result.idNumber);
      break;
    }
  }

  // 签发机关提取
  // 策略1: 正则提取
  const authorityPatterns = [
    /签发机关\s*[：:]?\s*(.+?)(?=有效期|有效期限|\d{4}|$)/i, // 遇到有效期或数字停止
    /签发机关\s*(.+公安局[^\s]*)/i,
    /(.+?公安局.+?分局)/i, // 常见的 xxxx分局
    /(.+?公安局)/i,
  ];
  for (const pattern of authorityPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      // 强力去噪：去掉末尾可能跟随的日期数字
      result.authority = match[1]
        .replace(/\s+/g, "")
        .replace(/\d{4}.*$/, "")
        .trim();
      if (result.authority.length >= 4) break;
    }
  }

  // 有效期限提取 - 格式 YYYY.MM.DD-YYYY.MM.DD 或 YYYY.MM.DD-长期
  // 优化：支持更多样的日期分隔符 (.) (-) (/) (年)
  const validPatterns = [
    /有效期限\s*[：:]?\s*(\d{4})[.\-/年](\d{1,2})[.\-/月](\d{1,2})\s*[-至到—]\s*(\d{4})[.\-/年](\d{1,2})[.\-/月](\d{1,2})/,
    /有效期限\s*[：:]?\s*(\d{4})[.\-/年](\d{1,2})[.\-/月](\d{1,2})\s*[-至到—]\s*(长期)/,
    /(\d{4})\.(\d{1,2})\.(\d{1,2})\s*[-—]\s*(\d{4})\.(\d{1,2})\.(\d{1,2})/,
    /(\d{4})\.(\d{1,2})\.(\d{1,2})\s*[-—]\s*(长期)/,
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

  // ========== 智能行匹配 (Intelligent Line Parsing) ==========
  if (lines && lines.length > 0) {
    // 1. 签发机关智能匹配
    if (!result.authority || result.authority.length < 4) {
      for (const line of lines) {
        // 必须包含 "公安" 或者 "分局" 且不含 "签发" (如果是签发机关一行则跳过)
        // 或者是 "签发机关xxx" 这种
        let cleanLine = line.trim().replace(/\s+/g, "");
        if (cleanLine.includes("公安") || cleanLine.includes("分局")) {
          // 清理掉前缀
          cleanLine = cleanLine.replace(/签发机关/g, "").replace(/[:：]/g, "");
          // 清理掉可能的日期后缀
          cleanLine = cleanLine.replace(/\d{4}.*$/, "");

          if (cleanLine.length >= 4) {
            result.authority = cleanLine;
            break;
          }
        }
      }
    }
    // 2. 有效期限智能匹配 (如果正则没拿到)
    if (!result.validPeriod.start) {
      for (const line of lines) {
        const dateMatch = line.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
        if (dateMatch) {
          // 这里简单处理，如果一行里有两个日期，可能是有效期
          const matches = line.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/g);
          if (matches && matches.length >= 2) {
            // 提取第一组和第二组
            // 需要更细致的 parsing，暂且略过，正则通常能搞定
          }
        }
      }
    }
  }

  // ========== 有效证件验证 ==========

  // 1. 关键词检测
  const hasIdCardTitleKeyword = /中华人民共和国|居民身份证/.test(text); // 放宽: 只要有一个就能通过
  const hasAuthorityKeyword = /签发机关/.test(text) || /公安/.test(text);
  const hasValidPeriodKeyword =
    /有效期限/.test(text) || /\d{4}-\d{2}-\d{2}/.test(text);

  // 必须包含全部3个关键词
  const keywordCount = [
    hasIdCardTitleKeyword,
    hasAuthorityKeyword,
    hasValidPeriodKeyword,
  ].filter(Boolean).length;

  const hasAllKeywords = keywordCount >= 3; // 严格模式：必须包含全部3个特征

  // 2. 字段值验证
  const isValidIdNumber =
    result.idNumber &&
    result.idNumber.length === 18 &&
    result.validation?.valid === true;

  const isValidAuthority =
    result.authority &&
    result.authority.length >= 4 &&
    /公安/.test(result.authority);

  // 有效期限校验
  let periodValidation = null;
  let isValidPeriod = false;
  if (result.validPeriod.start && result.validPeriod.end) {
    periodValidation = validateIdCardValidPeriod(
      result.validPeriod.start,
      result.validPeriod.end
    );
    isValidPeriod = periodValidation.valid;
    result.isExpired = periodValidation.isExpired;
  }

  // 3. 综合判断
  // 只要机关或有效期其中每一个提取正确，且有足够的关键词，就算有效
  const isValid = hasAllKeywords && (isValidAuthority || isValidPeriod);

  result.valid = isValid;
  result.isValid = isValid;

  // 严格判定：是否为身份证 (背面)
  // 必须具备：标题特征 OR 签发机关+有效期特征
  result.isIdCard =
    hasIdCardTitleKeyword || (hasAuthorityKeyword && hasValidPeriodKeyword);

  // 4. 添加验证详情
  result.validationDetails = {
    keywords: {
      hasIdCardTitleKeyword,
      hasAuthorityKeyword,
      hasValidPeriodKeyword,
      keywordCount,
      hasAllKeywords,
    },
    fields: {
      isValidIdNumber,
      isValidAuthority,
      isValidPeriod,
    },
    periodValidation,
  };

  return result;
}

/**
 * 智能解析身份证（自动判断正反面）
 * @param {string} text - OCR 识别的原始文本
 * @param {Array} lines - OCR 识别的行列表
 * @returns {Object} 解析结果
 */
export function parseIdCard(text, lines = []) {
  const side = detectIdCardSide(text);

  if (side === "front") {
    return parseIdCardFront(text, lines);
  } else if (side === "back") {
    return parseIdCardBack(text, lines);
  } else {
    // 无法判断时，尝试两种解析，返回置信度更高的
    const frontResult = parseIdCardFront(text, lines);
    const backResult = parseIdCardBack(text, lines);

    const frontScore = Object.values(
      frontResult.validationDetails.fields || {}
    ).filter(Boolean).length;
    const backScore = Object.values(
      backResult.validationDetails.fields || {}
    ).filter(Boolean).length;

    if (frontScore >= backScore) {
      frontResult.side = "front";
      return frontResult;
    } else {
      backResult.side = "back";
      return backResult;
    }
  }
}

/**
 * 合并身份证正反面信息
 * @param {Object} front - 正面识别结果
 * @param {Object} back - 背面识别结果
 * @returns {Object} 完整的身份证信息
 */
export function mergeIdCardInfo(front, back) {
  return {
    // 正面信息
    name: front.name || "",
    gender: front.gender || "",
    ethnicity: front.ethnicity || "",
    birthDate: front.birthDate || "",
    address: front.address || "",
    // 背面信息
    idNumber: back.idNumber || front.idNumber || "",
    authority: back.authority || "",
    validPeriod: back.validPeriod || { start: "", end: "" },
    // 验证信息
    validation: back.validation,
    isExpired: back.isExpired,
    // 格式化信息
    formatted: back.idNumber ? formatIdCard(back.idNumber) : null,
    // 完整性标记
    isComplete: front.valid && back.valid,
  };
}

/**
 * 从身份证号提取信息
 * @param {string} idNumber - 18位身份证号
 * @returns {Object} 提取的信息
 */
export function extractFromIdNumber(idNumber) {
  if (!idNumber || idNumber.length !== 18) {
    return null;
  }

  const year = idNumber.substring(6, 10);
  const month = idNumber.substring(10, 12);
  const day = idNumber.substring(12, 14);
  const genderCode = parseInt(idNumber.charAt(16));

  return {
    region: idNumber.substring(0, 6),
    birthDate: `${year}年${month}月${day}日`,
    gender: genderCode % 2 === 1 ? "男" : "女",
    age: calculateAge(year, month, day),
  };
}

/**
 * 计算年龄
 * @private
 */
function calculateAge(year, month, day) {
  const today = new Date();
  const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export default {
  detectIdCardSide,
  parseIdCard,
  parseIdCardFront,
  parseIdCardBack,
  mergeIdCardInfo,
  extractFromIdNumber,
  ID_CARD_FRONT_REGIONS,
  ID_CARD_BACK_REGIONS,
};
