/**
 * 格式化工具函数
 *
 * @author luciaocr
 * @version 1.0.0
 */

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {string} format - 格式字符串，默认 YYYY-MM-DD
 * @returns {string} 格式化后的日期
 */
export function formatDate(date, format = "YYYY-MM-DD") {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  return format
    .replace("YYYY", year)
    .replace("MM", String(month).padStart(2, "0"))
    .replace("DD", String(day).padStart(2, "0"))
    .replace("HH", String(hours).padStart(2, "0"))
    .replace("mm", String(minutes).padStart(2, "0"))
    .replace("ss", String(seconds).padStart(2, "0"))
    .replace("M", month)
    .replace("D", day);
}

/**
 * 格式化金额
 * @param {number|string} amount - 金额
 * @param {Object} options - 配置选项
 * @returns {string} 格式化后的金额
 */
export function formatAmount(amount, options = {}) {
  const {
    prefix = "¥",
    decimals = 2,
    thousandsSeparator = ",",
    decimalSeparator = ".",
  } = options;

  if (amount === null || amount === undefined || amount === "") {
    return "";
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "";

  const fixed = num.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");

  // 添加千分位分隔符
  const formattedInt = intPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator
  );

  return `${prefix}${formattedInt}${decimalSeparator}${decPart}`;
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的大小
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

/**
 * 格式化时间间隔（用于显示识别耗时等）
 * @param {number} ms - 毫秒数
 * @returns {string} 格式化后的时间
 */
export function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * 格式化百分比
 * @param {number} value - 数值 (0-100 或 0-1)
 * @param {Object} options - 配置选项
 * @returns {string} 格式化后的百分比
 */
export function formatPercentage(value, options = {}) {
  const { decimals = 1, suffix = "%", autoScale = true } = options;

  if (value === null || value === undefined) return "";

  // 自动判断是否需要乘以100
  let num = value;
  if (autoScale && num <= 1) {
    num = num * 100;
  }

  return `${num.toFixed(decimals)}${suffix}`;
}

/**
 * 格式化手机号（隐藏中间4位）
 * @param {string} phone - 手机号
 * @param {string} maskChar - 遮罩字符
 * @returns {string} 格式化后的手机号
 */
export function formatPhone(phone, maskChar = "*") {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 11) return phone;

  return `${cleaned.substring(0, 3)}${maskChar.repeat(4)}${cleaned.substring(
    7
  )}`;
}

/**
 * 格式化姓名（隐藏部分）
 * @param {string} name - 姓名
 * @param {string} maskChar - 遮罩字符
 * @returns {string} 格式化后的姓名
 */
export function formatName(name, maskChar = "*") {
  if (!name) return "";

  if (name.length <= 1) return name;
  if (name.length === 2) return name.charAt(0) + maskChar;

  return (
    name.charAt(0) +
    maskChar.repeat(name.length - 2) +
    name.charAt(name.length - 1)
  );
}

/**
 * 格式化地址（隐藏详细地址）
 * @param {string} address - 地址
 * @param {number} keepLength - 保留的前几个字符
 * @returns {string} 格式化后的地址
 */
export function formatAddress(address, keepLength = 12) {
  if (!address) return "";

  if (address.length <= keepLength) return address;

  return address.substring(0, keepLength) + "***";
}

/**
 * OCR 结果格式化
 * @param {Object} result - OCR 识别结果
 * @returns {Object} 格式化后的结果
 */
export function formatOCRResult(result) {
  if (!result) return null;

  return {
    ...result,
    durationText: formatDuration(result.duration || 0),
    confidenceText: formatPercentage(result.confidence || 0, {
      autoScale: false,
    }),
  };
}

/**
 * 将中文数字转换为阿拉伯数字
 * @param {string} chineseNum - 中文数字
 * @returns {number} 阿拉伯数字
 */
export function chineseToNumber(chineseNum) {
  if (!chineseNum) return 0;

  const numMap = {
    零: 0,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    〇: 0,
    壹: 1,
    贰: 2,
    叁: 3,
    肆: 4,
    伍: 5,
    陆: 6,
    柒: 7,
    捌: 8,
    玖: 9,
  };

  const unitMap = {
    十: 10,
    拾: 10,
    百: 100,
    佰: 100,
    千: 1000,
    仟: 1000,
    万: 10000,
    亿: 100000000,
  };

  let result = 0;
  let temp = 0;
  let section = 0;

  for (const char of chineseNum) {
    if (numMap[char] !== undefined) {
      temp = numMap[char];
    } else if (unitMap[char] !== undefined) {
      const unit = unitMap[char];
      if (unit >= 10000) {
        section = (section + temp) * unit;
        temp = 0;
      } else {
        section += temp * unit;
        temp = 0;
      }
    }
  }

  result = section + temp;
  return result;
}

/**
 * 将阿拉伯数字转换为中文数字
 * @param {number} num - 阿拉伯数字
 * @returns {string} 中文数字
 */
export function numberToChinese(num) {
  if (num === 0) return "零";

  const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const units = ["", "十", "百", "千"];
  const bigUnits = ["", "万", "亿"];

  let result = "";
  let unitIndex = 0;
  let prevZero = false;

  while (num > 0) {
    const section = num % 10000;
    let sectionStr = "";
    let sectionNum = section;
    let pos = 0;

    while (sectionNum > 0) {
      const digit = sectionNum % 10;
      if (digit === 0) {
        if (!prevZero && sectionStr) {
          sectionStr = digits[0] + sectionStr;
          prevZero = true;
        }
      } else {
        sectionStr = digits[digit] + units[pos] + sectionStr;
        prevZero = false;
      }
      sectionNum = Math.floor(sectionNum / 10);
      pos++;
    }

    if (sectionStr) {
      result = sectionStr + bigUnits[unitIndex] + result;
    }

    num = Math.floor(num / 10000);
    unitIndex++;
  }

  // 处理"一十"开头的情况
  if (result.startsWith("一十")) {
    result = result.substring(1);
  }

  return result;
}

export default {
  formatDate,
  formatAmount,
  formatFileSize,
  formatDuration,
  formatPercentage,
  formatPhone,
  formatName,
  formatAddress,
  formatOCRResult,
  chineseToNumber,
  numberToChinese,
};
