/**
 * 通用文字识别模板
 *
 * @author luciaocr
 * @version 1.0.0
 */

/**
 * 通用识别结果解析
 * @param {string} text - OCR 识别的原始文本
 * @param {Object} options - 解析选项
 * @returns {Object} 解析后的结果
 */
export function parseGeneral(text, options = {}) {
  const {
    extractNumbers = true,
    extractDates = true,
    extractEmails = true,
    extractPhones = true,
    extractUrls = true,
    lineByLine = true,
  } = options;

  const result = {
    valid: true,
    rawText: text,
    cleanText: "",
    lines: [],
    wordCount: 0,
    charCount: 0,
    extracted: {},
  };

  // 清理文本
  result.cleanText = text.replace(/\s+/g, " ").trim();
  result.charCount = result.cleanText.length;

  // 按行分割
  if (lineByLine) {
    result.lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  // 统计词数（中英文混合）
  const words = result.cleanText.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g);
  result.wordCount = words ? words.length : 0;

  // 提取数字
  if (extractNumbers) {
    result.extracted.numbers = extractNumbersFromText(text);
  }

  // 提取日期
  if (extractDates) {
    result.extracted.dates = extractDatesFromText(text);
  }

  // 提取邮箱
  if (extractEmails) {
    result.extracted.emails = extractEmailsFromText(text);
  }

  // 提取电话号码
  if (extractPhones) {
    result.extracted.phones = extractPhonesFromText(text);
  }

  // 提取网址
  if (extractUrls) {
    result.extracted.urls = extractUrlsFromText(text);
  }

  return result;
}

/**
 * 从文本中提取数字
 * @param {string} text - 原始文本
 * @returns {Array} 数字数组
 */
export function extractNumbersFromText(text) {
  const patterns = [
    // 金额（包含小数点和千分位）
    /[¥￥$]?\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/g,
    // 普通数字（整数和小数）
    /-?\d+(?:\.\d+)?/g,
  ];

  const numbers = new Set();

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const cleaned = match.replace(/[¥￥$,\s]/g, "");
        if (cleaned && !isNaN(parseFloat(cleaned))) {
          numbers.add(cleaned);
        }
      });
    }
  }

  return Array.from(numbers).map((n) => ({
    value: n,
    numeric: parseFloat(n),
  }));
}

/**
 * 从文本中提取日期
 * @param {string} text - 原始文本
 * @returns {Array} 日期数组
 */
export function extractDatesFromText(text) {
  const patterns = [
    // 中文日期格式
    /(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g,
    // 标准日期格式 YYYY-MM-DD
    /(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/g,
    // 中文月日
    /(\d{1,2})\s*月\s*(\d{1,2})\s*日/g,
  ];

  const dates = [];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      let dateStr = match[0];
      let formatted = null;

      if (match.length === 4) {
        // 完整日期
        const year = match[1];
        const month = match[2].padStart(2, "0");
        const day = match[3].padStart(2, "0");
        formatted = `${year}-${month}-${day}`;
      } else if (match.length === 3) {
        // 月日
        const month = match[1].padStart(2, "0");
        const day = match[2].padStart(2, "0");
        formatted = `${month}-${day}`;
      }

      dates.push({
        original: dateStr,
        formatted: formatted,
      });
    }
  }

  return dates;
}

/**
 * 从文本中提取邮箱
 * @param {string} text - 原始文本
 * @returns {Array} 邮箱数组
 */
export function extractEmailsFromText(text) {
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(pattern);
  return matches || [];
}

/**
 * 从文本中提取电话号码
 * @param {string} text - 原始文本
 * @returns {Array} 电话号码数组
 */
export function extractPhonesFromText(text) {
  const patterns = [
    // 手机号
    /1[3-9]\d{9}/g,
    // 固定电话（带区号）
    /0\d{2,3}[-\s]?\d{7,8}/g,
    // 400/800 电话
    /[48]00[-\s]?\d{3}[-\s]?\d{4}/g,
  ];

  const phones = new Set();

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((phone) => {
        phones.add(phone.replace(/[-\s]/g, ""));
      });
    }
  }

  return Array.from(phones).map((phone) => ({
    number: phone,
    type: getPhoneType(phone),
  }));
}

/**
 * 获取电话号码类型
 * @param {string} phone - 电话号码
 * @returns {string} 类型
 */
function getPhoneType(phone) {
  if (/^1[3-9]/.test(phone)) {
    return "mobile";
  } else if (/^0/.test(phone)) {
    return "landline";
  } else if (/^[48]00/.test(phone)) {
    return "service";
  }
  return "unknown";
}

/**
 * 从文本中提取网址
 * @param {string} text - 原始文本
 * @returns {Array} 网址数组
 */
export function extractUrlsFromText(text) {
  const pattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = text.match(pattern);
  return matches || [];
}

/**
 * 提取关键词
 * @param {string} text - 原始文本
 * @param {number} topN - 返回前N个关键词
 * @returns {Array} 关键词数组
 */
export function extractKeywords(text, topN = 10) {
  // 分词（简单实现，中文按字符，英文按空格）
  const words = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];

  // 统计词频
  const wordCount = {};
  for (const word of words) {
    const lower = word.toLowerCase();
    // 过滤常见停用词
    if (STOP_WORDS.includes(lower) || word.length < 2) continue;
    wordCount[word] = (wordCount[word] || 0) + 1;
  }

  // 排序并返回 topN
  const sorted = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return sorted.map(([word, count]) => ({ word, count }));
}

/**
 * 常见停用词
 */
const STOP_WORDS = [
  "的",
  "了",
  "是",
  "在",
  "我",
  "有",
  "和",
  "就",
  "不",
  "人",
  "都",
  "一",
  "一个",
  "上",
  "也",
  "很",
  "到",
  "说",
  "要",
  "去",
  "你",
  "会",
  "着",
  "没有",
  "看",
  "好",
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "and",
  "or",
  "but",
  "if",
  "then",
  "else",
  "when",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
];

/**
 * 文本摘要（简单实现）
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 摘要
 */
export function summarize(text, maxLength = 100) {
  const sentences = text.split(/[。！？.!?]/).filter((s) => s.trim());

  if (sentences.length === 0) {
    return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
  }

  let summary = "";
  for (const sentence of sentences) {
    if ((summary + sentence).length <= maxLength) {
      summary += sentence + "。";
    } else {
      break;
    }
  }

  return summary || sentences[0].slice(0, maxLength) + "...";
}

export default {
  parseGeneral,
  extractNumbersFromText,
  extractDatesFromText,
  extractEmailsFromText,
  extractPhonesFromText,
  extractUrlsFromText,
  extractKeywords,
  summarize,
};
