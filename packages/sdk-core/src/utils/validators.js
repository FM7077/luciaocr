/**
 * 校验工具函数
 *
 * @author luciaocr
 * @version 1.0.0
 * @description 根据规范更新的校验规则
 */

/**
 * 判断是否为闰年
 * @param {number} year - 年份
 * @returns {boolean}
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取某月的天数
 * @param {number} year - 年份
 * @param {number} month - 月份 (1-12)
 * @returns {number}
 */
function getDaysInMonth(year, month) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return days[month - 1];
}

/**
 * 验证日期是否合法
 * @param {number} year - 年份
 * @param {number} month - 月份 (1-12)
 * @param {number} day - 日 (1-31)
 * @returns {boolean}
 */
export function isValidDate(year, month, day) {
  // 年份范围检查
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return false;
  }
  // 月份检查
  if (month < 1 || month > 12) {
    return false;
  }
  // 日期检查
  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) {
    return false;
  }
  return true;
}

/**
 * 验证身份证号码（18位）
 * 校验规则:
 * - 长度必须为18位
 * - 前17位必须全为数字，第18位为数字或大写X
 * - 第7-14位为出生日期（YYYYMMDD），需满足年份合理、月份01-12、日根据月份合法（考虑闰年）
 * - 第18位为校验码，使用加权算法
 *
 * @param {string} idNumber - 18位身份证号
 * @returns {Object} 验证结果
 */
export function validateIdCard(idNumber) {
  const result = {
    valid: false,
    message: "",
    info: null,
  };

  if (!idNumber) {
    result.message = "身份证号码不能为空";
    return result;
  }

  // 去除空格并转大写
  idNumber = idNumber.replace(/\s/g, "").toUpperCase();

  // 1. 长度校验：必须为18位
  if (idNumber.length !== 18) {
    result.message = "身份证号码长度必须为18位";
    return result;
  }

  // 2. 格式校验：前17位必须全为数字，第18位为数字或大写X
  if (!/^\d{17}[\dX]$/.test(idNumber)) {
    result.message =
      "身份证号码格式不正确（前17位必须为数字，第18位为数字或X）";
    return result;
  }

  // 3. 地区码校验（前2位，可不强制校验具体有效性，但做基本范围检查）
  const areaCode = parseInt(idNumber.substring(0, 2));
  const validAreaCodes = [
    11,
    12,
    13,
    14,
    15, // 北京、天津、河北、山西、内蒙古
    21,
    22,
    23, // 辽宁、吉林、黑龙江
    31,
    32,
    33,
    34,
    35,
    36,
    37, // 上海、江苏、浙江、安徽、福建、江西、山东
    41,
    42,
    43,
    44,
    45,
    46, // 河南、湖北、湖南、广东、广西、海南
    50,
    51,
    52,
    53,
    54, // 重庆、四川、贵州、云南、西藏
    61,
    62,
    63,
    64,
    65, // 陕西、甘肃、青海、宁夏、新疆
    71, // 台湾
    81,
    82, // 香港、澳门
  ];

  if (!validAreaCodes.includes(areaCode)) {
    result.message = "身份证地区码无效";
    return result;
  }

  // 4. 出生日期校验（第7-14位）
  const year = parseInt(idNumber.substring(6, 10));
  const month = parseInt(idNumber.substring(10, 12));
  const day = parseInt(idNumber.substring(12, 14));

  // 年份范围: 1900 - 当前年份
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    result.message = "出生年份不合理";
    return result;
  }

  // 月份: 01-12
  if (month < 1 || month > 12) {
    result.message = "出生月份不合理";
    return result;
  }

  // 日期: 根据月份和闰年判断
  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) {
    result.message = "出生日期不合理";
    return result;
  }

  // 确保出生日期不超过当前日期
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  if (birthDate > today) {
    result.message = "出生日期不能晚于当前日期";
    return result;
  }

  // 5. 校验码计算
  // 加权因子（从左到右，第1到第17位）
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码对照表（余数 → 校验码）: 0→1, 1→0, 2→X, 3→9, 4→8, 5→7, 6→6, 7→5, 8→4, 9→3, 10→2
  const checkCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idNumber.charAt(i)) * weights[i];
  }

  const expectedCheckCode = checkCodes[sum % 11];
  const actualCheckCode = idNumber.charAt(17);

  if (expectedCheckCode !== actualCheckCode) {
    result.message = "身份证校验码错误";
    return result;
  }

  // 6. 提取信息
  // 第17位奇数表示男性，偶数表示女性
  const genderCode = parseInt(idNumber.charAt(16));
  const gender = genderCode % 2 === 1 ? "男" : "女";

  result.valid = true;
  result.message = "身份证号码有效";
  result.info = {
    region: idNumber.substring(0, 6),
    birthDate: `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`,
    gender: gender,
    age: calculateAge(year, month, day),
  };

  return result;
}

/**
 * 计算年龄
 * @private
 */
function calculateAge(year, month, day) {
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() + 1 - month;

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }

  return age;
}

/**
 * 格式化身份证号码（隐藏部分信息）
 * @param {string} idNumber - 身份证号
 * @param {string} maskChar - 遮罩字符，默认 *
 * @returns {Object} 格式化结果
 */
export function formatIdCard(idNumber, maskChar = "*") {
  if (!idNumber || idNumber.length !== 18) {
    return null;
  }

  return {
    full: idNumber,
    // 只显示前6后4
    masked:
      idNumber.substring(0, 6) + maskChar.repeat(8) + idNumber.substring(14),
    // 只显示出生日期部分
    birthOnly: idNumber.substring(6, 14),
  };
}

/**
 * 验证身份证有效期限
 * 格式: YYYY.MM.DD-YYYY.MM.DD 或 YYYY.MM.DD-长期
 * 规则:
 * - 起始日期 ≤ 结束日期
 * - 若非"长期"，结束日期 ≥ 当前日期
 *
 * @param {string} startDate - 起始日期 (YYYY.MM.DD 或 YYYY-MM-DD)
 * @param {string} endDate - 结束日期 (YYYY.MM.DD 或 YYYY-MM-DD 或 "长期")
 * @returns {Object} 验证结果
 */
export function validateIdCardValidPeriod(startDate, endDate) {
  const result = {
    valid: false,
    message: "",
    isExpired: false,
    isLongTerm: false,
  };

  if (!startDate) {
    result.message = "起始日期不能为空";
    return result;
  }

  if (!endDate) {
    result.message = "结束日期不能为空";
    return result;
  }

  // 检查是否为长期
  if (endDate === "长期") {
    result.valid = true;
    result.isLongTerm = true;
    result.message = "长期有效";
    return result;
  }

  // 解析日期 (支持 YYYY.MM.DD 和 YYYY-MM-DD 格式)
  const parseDate = (dateStr) => {
    const match = dateStr.match(/(\d{4})[.\-/](\d{2})[.\-/](\d{2})/);
    if (!match) return null;
    return new Date(
      parseInt(match[1]),
      parseInt(match[2]) - 1,
      parseInt(match[3])
    );
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start) {
    result.message = "起始日期格式不正确";
    return result;
  }

  if (!end) {
    result.message = "结束日期格式不正确";
    return result;
  }

  // 起始日期 ≤ 结束日期
  if (start > end) {
    result.message = "起始日期不能晚于结束日期";
    return result;
  }

  // 结束日期 ≥ 当前日期
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (end < today) {
    result.valid = false;
    result.isExpired = true;
    result.message = "证件已过期";
    return result;
  }

  result.valid = true;
  result.message = "有效期限正常";
  return result;
}

/**
 * 验证银行卡号（Luhn 算法）
 * 校验规则:
 * - 长度 13-19 位（最常见 16 或 19 位）
 * - 去除所有非数字字符，只保留数字
 * - Luhn 算法校验
 *
 * @param {string} cardNumber - 银行卡号
 * @returns {Object} 验证结果
 */
export function validateBankCard(cardNumber) {
  const result = {
    valid: false,
    message: "",
    info: null,
  };

  if (!cardNumber) {
    result.message = "银行卡号不能为空";
    return result;
  }

  // 去除所有非数字字符
  cardNumber = cardNumber.replace(/\D/g, "");

  // 长度校验：银行卡号通常为 13-19 位
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    result.message = "银行卡号长度应为13-19位";
    return result;
  }

  // Luhn 算法校验
  // 从右向左逐位处理：
  // - 最右侧位（校验位）不处理
  // - 从右数第 2、4、6…位（即偶数位）先乘 2
  // - 若结果 ≥ 10，则个位 + 十位（等同于减 9）
  // - 所有位求和，总和能被 10 整除则校验通过
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9; // 等同于 个位 + 十位
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    result.message = "银行卡号校验失败（Luhn校验不通过）";
    return result;
  }

  result.valid = true;
  result.message = "银行卡号有效";
  result.info = {
    length: cardNumber.length,
    bin: cardNumber.substring(0, 6),
  };

  return result;
}

/**
 * 验证银行卡有效期
 * 格式: MM/YY 或 MM/YYYY
 * 规则:
 * - 月份 01-12
 * - 到期年月 ≥ 当前年月（视为当月末到期）
 *
 * @param {string} expiry - 有效期 (MM/YY 或 MM/YYYY)
 * @returns {Object} 验证结果
 */
export function validateBankCardExpiry(expiry) {
  const result = {
    valid: false,
    message: "",
    isExpired: false,
  };

  if (!expiry) {
    result.message = "有效期不能为空";
    return result;
  }

  // 解析格式 MM/YY 或 MM/YYYY
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/);
  if (!match) {
    result.message = "有效期格式不正确（应为 MM/YY 或 MM/YYYY）";
    return result;
  }

  const month = parseInt(match[1]);
  let year = parseInt(match[2]);

  // 如果是2位年份，转换为4位
  if (year < 100) {
    year += 2000;
  }

  // 获取当前年月
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // 到期年月 ≥ 当前年月
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    result.valid = false;
    result.isExpired = true;
    result.message = "银行卡已过期";
    return result;
  }

  result.valid = true;
  result.message = "有效期正常";
  return result;
}

/**
 * 格式化银行卡号（每4位加空格）
 * @param {string} cardNumber - 银行卡号
 * @returns {string} 格式化后的卡号
 */
export function formatBankCard(cardNumber) {
  if (!cardNumber) return "";

  // 去除非数字字符
  const cleaned = cardNumber.replace(/\D/g, "");

  // 每4位加空格
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * 隐藏银行卡号中间部分
 * @param {string} cardNumber - 银行卡号
 * @param {string} maskChar - 遮罩字符
 * @returns {string} 遮罩后的卡号
 */
export function maskBankCard(cardNumber, maskChar = "*") {
  if (!cardNumber) return "";

  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 8) return cleaned;

  const start = cleaned.substring(0, 4);
  const end = cleaned.substring(cleaned.length - 4);
  const middle = maskChar.repeat(cleaned.length - 8);

  return `${start} ${middle} ${end}`;
}

/**
 * 验证驾驶证证号
 * 规则:
 * - 新版驾驶证：12位纯数字
 *
 * @param {string} licenseNumber - 驾驶证证号
 * @returns {Object} 验证结果
 */
export function validateDriverLicenseNumber(licenseNumber) {
  const result = {
    valid: false,
    message: "",
  };

  if (!licenseNumber) {
    result.message = "驾驶证证号不能为空";
    return result;
  }

  // 去除空格
  licenseNumber = licenseNumber.replace(/\s/g, "");

  // 长度必须为12位
  if (licenseNumber.length !== 12) {
    result.message = "驾驶证证号长度必须为12位";
    return result;
  }

  // 必须为纯数字
  if (!/^\d{12}$/.test(licenseNumber)) {
    result.message = "驾驶证证号必须为12位纯数字";
    return result;
  }

  result.valid = true;
  result.message = "驾驶证证号格式正确";
  return result;
}

/**
 * 验证档案编号（驾驶证副页）
 * 规则:
 * - 12位纯数字
 * - 前4-6位通常对应行政区划代码（可选校验）
 *
 * @param {string} archiveNumber - 档案编号
 * @returns {Object} 验证结果
 */
export function validateArchiveNumber(archiveNumber) {
  const result = {
    valid: false,
    message: "",
  };

  if (!archiveNumber) {
    result.message = "档案编号不能为空";
    return result;
  }

  // 去除空格
  archiveNumber = archiveNumber.replace(/\s/g, "");

  // 长度必须为12位
  if (archiveNumber.length !== 12) {
    result.message = "档案编号长度必须为12位";
    return result;
  }

  // 必须为纯数字
  if (!/^\d{12}$/.test(archiveNumber)) {
    result.message = "档案编号必须为12位纯数字";
    return result;
  }

  result.valid = true;
  result.message = "档案编号格式正确";
  return result;
}

/**
 * 验证准驾车型
 * 标准车型列表: A1、A2、A3、B1、B2、C1、C2、C3、C4、D、E、F、M、N、P
 *
 * @param {string} licenseClass - 准驾车型
 * @returns {Object} 验证结果
 */
export function validateLicenseClass(licenseClass) {
  const result = {
    valid: false,
    message: "",
    description: "",
  };

  if (!licenseClass) {
    result.message = "准驾车型不能为空";
    return result;
  }

  // 标准车型列表
  const validClasses = {
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

  // 转大写并去除空格
  const classCode = licenseClass.toUpperCase().replace(/\s/g, "");

  // 可能包含多个车型，如 "C1E"
  // 提取所有车型代码
  const classPattern = /([A-Z][1-5]?)/g;
  const matches = classCode.match(classPattern);

  if (!matches || matches.length === 0) {
    result.message = "准驾车型格式不正确";
    return result;
  }

  // 验证每个车型是否在标准列表中
  const descriptions = [];
  for (const code of matches) {
    if (validClasses[code]) {
      descriptions.push(validClasses[code]);
    } else {
      result.message = `未知的准驾车型: ${code}`;
      return result;
    }
  }

  result.valid = true;
  result.message = "准驾车型有效";
  result.description = descriptions.join("、");
  return result;
}

/**
 * 验证驾驶证有效期限
 * 格式: YYYY.MM.DD - YYYY.MM.DD 或至 "长期"
 * 规则:
 * - 有效起始日期 ≤ 有效结束日期
 * - 若非"长期"，有效结束日期 ≥ 当前日期
 *
 * @param {string} startDate - 起始日期
 * @param {string} endDate - 结束日期 或 "长期"
 * @returns {Object} 验证结果
 */
export function validateDriverLicenseValidPeriod(startDate, endDate) {
  // 复用身份证有效期限校验逻辑
  return validateIdCardValidPeriod(startDate, endDate);
}

/**
 * 验证手机号码
 * @param {string} phone - 手机号码
 * @returns {Object} 验证结果
 */
export function validatePhone(phone) {
  const result = {
    valid: false,
    message: "",
    carrier: "",
  };

  if (!phone) {
    result.message = "手机号码不能为空";
    return result;
  }

  // 去除空格和横线
  phone = phone.replace(/[\s-]/g, "");

  // 手机号码正则
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    result.message = "手机号码格式不正确";
    return result;
  }

  // 运营商识别
  const prefix = phone.substring(0, 3);
  const carrierMap = {
    // 移动
    134: "移动",
    135: "移动",
    136: "移动",
    137: "移动",
    138: "移动",
    139: "移动",
    147: "移动",
    148: "移动",
    150: "移动",
    151: "移动",
    152: "移动",
    157: "移动",
    158: "移动",
    159: "移动",
    172: "移动",
    178: "移动",
    182: "移动",
    183: "移动",
    184: "移动",
    187: "移动",
    188: "移动",
    195: "移动",
    197: "移动",
    198: "移动",
    // 联通
    130: "联通",
    131: "联通",
    132: "联通",
    145: "联通",
    146: "联通",
    155: "联通",
    156: "联通",
    166: "联通",
    171: "联通",
    175: "联通",
    176: "联通",
    185: "联通",
    186: "联通",
    196: "联通",
    // 电信
    133: "电信",
    149: "电信",
    153: "电信",
    173: "电信",
    174: "电信",
    177: "电信",
    180: "电信",
    181: "电信",
    189: "电信",
    190: "电信",
    191: "电信",
    193: "电信",
    199: "电信",
  };

  result.valid = true;
  result.message = "手机号码有效";
  result.carrier = carrierMap[prefix] || "未知运营商";

  return result;
}

/**
 * 验证邮箱地址
 * @param {string} email - 邮箱地址
 * @returns {Object} 验证结果
 */
export function validateEmail(email) {
  const result = {
    valid: false,
    message: "",
  };

  if (!email) {
    result.message = "邮箱地址不能为空";
    return result;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    result.message = "邮箱地址格式不正确";
    return result;
  }

  result.valid = true;
  result.message = "邮箱地址有效";

  return result;
}

/**
 * 验证车牌号
 * @param {string} plateNumber - 车牌号
 * @returns {Object} 验证结果
 */
export function validateLicensePlate(plateNumber) {
  const result = {
    valid: false,
    message: "",
    info: null,
  };

  if (!plateNumber) {
    result.message = "车牌号不能为空";
    return result;
  }

  // 去除空格
  plateNumber = plateNumber.replace(/\s/g, "").toUpperCase();

  // 普通车牌（蓝牌、黄牌）
  const normalPattern =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{5}$/;

  // 新能源车牌
  const newEnergyPattern =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][DF][A-HJ-NP-Z0-9]{5}$/;

  if (normalPattern.test(plateNumber)) {
    result.valid = true;
    result.message = "车牌号有效";
    result.info = {
      province: plateNumber.charAt(0),
      city: plateNumber.charAt(1),
      type: "普通车牌",
    };
  } else if (newEnergyPattern.test(plateNumber)) {
    result.valid = true;
    result.message = "车牌号有效";
    result.info = {
      province: plateNumber.charAt(0),
      city: plateNumber.charAt(1),
      type: "新能源车牌",
    };
  } else {
    result.message = "车牌号格式不正确";
  }

  return result;
}

export default {
  isValidDate,
  validateIdCard,
  formatIdCard,
  validateIdCardValidPeriod,
  validateBankCard,
  validateBankCardExpiry,
  formatBankCard,
  maskBankCard,
  validateDriverLicenseNumber,
  validateArchiveNumber,
  validateLicenseClass,
  validateDriverLicenseValidPeriod,
  validatePhone,
  validateEmail,
  validateLicensePlate,
};
