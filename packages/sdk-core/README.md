# @luciaocr/core

[English](./README.en.md)

`@luciaocr/core` 是 `luciaocr` 的纯逻辑核心层，负责 OCR 结果解析、字段提取、规则校验、格式化和统一错误模型。它不依赖 DOM、浏览器、iframe、WebView 或 React，适合在 Node 脚本、服务端后处理、测试环境和其他宿主 SDK 中复用。

## 能力概览

- 解析 `general`、`idCard-CN`、`bankCard`、`driverLicense-CN`
- 提取手机号、邮箱、日期、数字、关键词等信息
- 校验身份证、银行卡、驾驶证相关字段
- 提供统一错误类型 `OCRError`

## 安装

```bash
npm install @luciaocr/core
```

## 示例

```js
import {
  parseIdCard,
  parseBankCard,
  parseDriverLicenseAuto,
  validateIdCard,
} from "@luciaocr/core";

const idCard = parseIdCard(text, lines);
const bankCard = parseBankCard(text);
const driverLicense = parseDriverLicenseAuto(text, lines);

console.log(idCard, bankCard, driverLicense);
console.log(validateIdCard(idCard.idNumber));
```

## 主要导出

- 解析器：`parseGeneral`、`parseIdCard`、`parseIdCardFront`、`parseIdCardBack`、`parseBankCard`、`parseDriverLicenseAuto`
- 检测器：`detectIdCardSide`、`detectDriverLicensePage`
- 提取器：`extractNumbersFromText`、`extractDatesFromText`、`extractEmailsFromText`、`extractPhonesFromText`
- 校验器：`validateIdCard`、`validateBankCard`、`validateBankCardExpiry`、`validateDriverLicenseNumber`
- 工具：`formatIdCard`、`formatBankCard`、`formatOCRResult`

## 适用场景

- 仅做 OCR 后处理，不直接接识别引擎
- 对身份证 OCR 结果做结构化提取与校验
- 对银行卡 OCR 结果做卡号和有效期检查
- 对驾驶证 OCR 结果做字段标准化和规则校验

## License

[MIT](../../LICENSE)
