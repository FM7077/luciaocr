# @fm7077/luciaocr-core

> `luciaocr` 的纯逻辑核心层，提供 OCR 结果解析、校验、格式化和统一错误模型

GitHub：[`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## 致敬来源

本项目整体来源于对
[`ftcvictory/local-OCR`](https://github.com/ftcvictory/local-OCR)
离线 OCR 能力的整理、拆分与 React 化重构，`sdk-core` 承接其中的解析与结构化输出部分。

## 特性

- 不依赖 DOM、浏览器、WebView 或 React
- 提供 `general`、`idCard`、`bankCard`、`driverLicense` 解析器
- 提供身份证、银行卡、驾驶证、手机号、邮箱等校验器
- 提供常用格式化工具
- 提供统一错误模型 `OCRError`
- 可独立用于服务端脚本、Node 测试和宿主 SDK 的后处理

## 安装

```bash
npm install @fm7077/luciaocr-core
```

如果你是在当前仓库里联调，可以直接使用 workspace 包。

## 使用方式

### 方式一：解析通用文本

```js
import { parseGeneral } from "@fm7077/luciaocr-core";

const result = parseGeneral(`
联系电话 13800138000
邮箱 test@example.com
日期 2026-04-21
`);

console.log(result);
```

### 方式二：解析身份证

```js
import { parseIdCard, validateIdCard } from "@fm7077/luciaocr-core";

const text =
  "姓名 张三 性别 男 民族 汉 出生 1949年12月31日 住址 北京市朝阳区建国路88号 公民身份号码 11010519491231002X";

const result = parseIdCard(text, text.split(" "));

console.log(result);

if (result.idNumber) {
  console.log(validateIdCard(result.idNumber));
}
```

### 方式三：解析银行卡

```js
import { parseBankCard } from "@fm7077/luciaocr-core";

const result = parseBankCard(
  "中国农业银行 卡号 6228 4804 0256 4890 018 有效期 12/99 持卡人 张三"
);

console.log(result);
```

### 方式四：解析驾驶证

```js
import { parseDriverLicenseAuto } from "@fm7077/luciaocr-core";

const text =
  "中华人民共和国机动车驾驶证 姓名 张三 性别 男 国籍 中国 住址 北京市朝阳区建国路88号 出生日期 1990-01-01 初次领证日期 2012-05-06 准驾车型 C1 有效期限 2020-05-06至2030-05-06 证号 110101199001011234";

const result = parseDriverLicenseAuto(text, text.split(" "));

console.log(result);
```

## 导出内容

### 模板解析器

- `parseGeneral`
- `parseIdCard`
- `parseIdCardFront`
- `parseIdCardBack`
- `detectIdCardSide`
- `parseBankCard`
- `detectDriverLicensePage`
- `parseDriverLicense`
- `parseDriverLicenseSubPage`
- `parseDriverLicenseAuto`

### 提取工具

- `extractNumbersFromText`
- `extractDatesFromText`
- `extractEmailsFromText`
- `extractPhonesFromText`
- `extractUrlsFromText`
- `extractKeywords`
- `summarize`

### 校验器

- `validateIdCard`
- `validateIdCardValidPeriod`
- `validateBankCard`
- `validateBankCardExpiry`
- `validateDriverLicenseNumber`
- `validateArchiveNumber`
- `validateLicenseClass`
- `validateDriverLicenseValidPeriod`
- `validatePhone`
- `validateEmail`
- `validateLicensePlate`

### 格式化工具

- `formatDate`
- `formatAmount`
- `formatFileSize`
- `formatDuration`
- `formatPercentage`
- `formatPhone`
- `formatName`
- `formatAddress`
- `formatBankCard`
- `maskBankCard`
- `formatIdCard`
- `formatOCRResult`

### 错误与常量

- `OCRError`
- `OCR_ERROR_CODES`
- `OCR_TEMPLATES`

## 结果类型

### `GeneralTextResult`

```js
{
  valid: true,
  rawText: "联系电话 13800138000",
  cleanText: "联系电话 13800138000",
  lines: ["联系电话 13800138000"],
  wordCount: 2,
  charCount: 15,
  extracted: {
    phones: [{ number: "13800138000", type: "mobile" }]
  }
}
```

### `IdCardResult`

```js
{
  valid: true,
  side: "front",
  name: "张三",
  gender: "男",
  ethnicity: "汉族",
  birthDate: "1949年12月31日",
  address: "北京市朝阳区建国路88号",
  idNumber: "11010519491231002X"
}
```

### `BankCardResult`

```js
{
  valid: true,
  cardNumber: "6228480402564890018",
  cardNumberFormatted: "6228 4804 0256 4890 018",
  bankName: "中国农业银行",
  cardType: "借记卡",
  expiryDate: "12/99",
  isExpired: false
}
```

### `DriverLicenseResult`

```js
{
  valid: true,
  page: "main",
  name: "张三",
  gender: "男",
  nationality: "中国",
  licenseClass: "C1",
  licenseClassDesc: "小型汽车",
  validPeriod: {
    start: "2020.05.06",
    end: "2030.05.06"
  }
}
```

## 校验器示例

### 身份证校验

```js
import { validateIdCard } from "@fm7077/luciaocr-core";

const validation = validateIdCard("11010519491231002X");

console.log(validation.valid);
console.log(validation.info);
```

### 银行卡校验

```js
import { validateBankCard, validateBankCardExpiry } from "@fm7077/luciaocr-core";

console.log(validateBankCard("6228480402564890018"));
console.log(validateBankCardExpiry("12/99"));
```

### 手机号和邮箱校验

```js
import { validatePhone, validateEmail } from "@fm7077/luciaocr-core";

console.log(validatePhone("13800138000"));
console.log(validateEmail("test@example.com"));
```

## 错误模型

`sdk-core` 使用统一的 `OCRError`：

```js
import { OCRError } from "@fm7077/luciaocr-core";

throw new OCRError("PARSE_ERROR", "Failed to parse OCR result");
```

当前稳定错误码：

- `ASSET_LOAD_FAILED`
- `ENGINE_INIT_FAILED`
- `UNSUPPORTED_IMAGE_SOURCE`
- `RECOGNIZE_TIMEOUT`
- `BRIDGE_ERROR`
- `PARSE_ERROR`

## 适用场景

- 对 OCR 原始文本做结构化解析
- 对接自定义 OCR 引擎输出
- 在 Node 环境下做批量文本校验
- 在浏览器 / RN 宿主层之外独立复用解析逻辑
- 在测试里做固定样本回归

## 测试状态

当前已覆盖：

- 身份证正反面解析
- 银行卡解析与有效期
- 驾驶证主页解析
- 通用文本中的电话、邮箱、日期提取
- 每种模板 3 组文本回归样本：正常、模糊、错误类型

## 相关文档

- 仓库总览：[README.md](../../README.md)
- Web SDK：[packages/sdk-web/README.md](../sdk-web/README.md)

## License

[MIT](../../LICENSE)
