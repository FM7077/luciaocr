# luciaocr

[English](./README.en.md)

`luciaocr` 是一个面向前端与跨端场景的离线 OCR monorepo，围绕 OCR 识别、字段提取、规则校验、结构化输出和多端 SDK 封装构建。项目重点覆盖身份证 OCR、驾驶证 OCR、银行卡 OCR 和通用文本 OCR，可在浏览器、React、Vue、Angular 与 React Native 场景中完成证件识别、文本提取、字段校验、有效期检查与结构化结果输出。

如果你正在寻找支持身份证识别、驾驶证识别、银行卡识别、OCR 提取、OCR 校验、离线 OCR SDK、浏览器 OCR、Web OCR 或前端 OCR 的方案，这个仓库就是围绕这些能力组织的。

## 来源说明

本项目的离线 OCR 能力整理与工程化封装，参考并致敬来源项目：

- [`ftcvictory/local-OCR`](https://github.com/ftcvictory/local-OCR)

## 核心能力

- 离线 OCR：浏览器端本地运行，不依赖在线识别接口
- 证件识别：支持身份证、驾驶证、银行卡、通用文本
- 字段提取：从 OCR 原始文本中提取姓名、身份证号、卡号、有效期、住址、准驾车型、手机号、邮箱、日期等
- 结果校验：支持身份证号码校验、银行卡 Luhn 校验、银行卡有效期校验、驾驶证字段校验等
- 结构化输出：将 OCR 结果整理为稳定的数据对象，便于表单回填、风控、审核和归档
- 多端封装：提供 `core`、`web`、`react`、`vue`、`angular`、`react-native` 多层 SDK

## 重点识别场景

### 身份证 OCR

- 识别身份证正反面常见字段
- 提取姓名、性别、民族、出生日期、住址、身份证号
- 检测正反面
- 校验身份证号和有效期

### 驾驶证 OCR

- 识别机动车驾驶证主页与相关信息页
- 提取姓名、性别、国籍、住址、出生日期、初次领证日期、准驾车型、证号、有效期限
- 判断页面类型
- 校验驾驶证号、档案编号、准驾车型和有效期

### 银行卡 OCR

- 提取银行卡号、银行名称、卡类型、有效期、持卡人
- 自动清洗空格和 OCR 噪声
- 校验银行卡号和有效期
- 支持用于绑卡表单预填、支付资料核验和 OCR 后处理

## Packages

| Package | 作用 | 状态 |
| --- | --- | --- |
| `@luciaocr/core` | 共享解析器、校验器、格式化工具与错误模型 | Ready |
| `@luciaocr/web` | 浏览器离线 OCR 运行时与结构化识别入口 | Ready |
| `@luciaocr/react` | 基于 `@luciaocr/web` 的 React 封装 | Ready |
| `@luciaocr/vue` | 基于 `@luciaocr/web` 的 Vue 3 封装 | Ready |
| `@luciaocr/angular` | 基于 `@luciaocr/web` 的 Angular 封装 | Ready |
| `@luciaocr/react-native` | React Native WebView 桥接与运行时封装 | Not device-verified |

## Workspace Layout

```text
.
├── apps
│   ├── demo-angular
│   ├── demo-native
│   ├── demo-react
│   └── demo-vue
├── packages
│   ├── sdk-angular
│   ├── sdk-core
│   ├── sdk-react
│   ├── sdk-react-native
│   ├── sdk-vue
│   └── sdk-web
└── scripts
```

## 安装

React:

```bash
npm install @luciaocr/react
```

Vue 3:

```bash
npm install @luciaocr/vue
```

Angular:

```bash
npm install @luciaocr/angular
```

浏览器原生:

```bash
npm install @luciaocr/web
```

仅使用解析与校验:

```bash
npm install @luciaocr/core
```

## 快速开始

### 浏览器 OCR

```js
import { createWebOCR } from "@luciaocr/web";

const ocr = createWebOCR({
  assetBaseUrl: "/ocr-runtime/",
});

await ocr.init();

const idCardResult = await ocr.recognize(file, "idCard-CN");
const bankCardResult = await ocr.recognize(file, "bankCard");
const driverLicenseResult = await ocr.recognize(file, "driverLicense-CN");

console.log(idCardResult, bankCardResult, driverLicenseResult);

ocr.destroy();
```

### 仅做字段提取和校验

```js
import {
  parseIdCard,
  parseBankCard,
  parseDriverLicenseAuto,
  validateIdCard,
  validateBankCard,
} from "@luciaocr/core";

const idCard = parseIdCard(rawText, lines);
const bankCard = parseBankCard(rawText);
const driverLicense = parseDriverLicenseAuto(rawText, lines);

console.log(validateIdCard(idCard.idNumber));
console.log(validateBankCard(bankCard.cardNumber));
```

## 典型输出

身份证识别结果示例：

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

银行卡识别结果示例：

```js
{
  valid: true,
  bankName: "中国农业银行",
  cardNumber: "6228480402564890018",
  cardNumberFormatted: "6228 4804 0256 4890 018",
  expiryDate: "12/99",
  isExpired: false
}
```

驾驶证识别结果示例：

```js
{
  valid: true,
  page: "main",
  name: "张三",
  nationality: "中国",
  licenseClass: "C1",
  validPeriod: {
    start: "2020.05.06",
    end: "2030.05.06"
  }
}
```

## 适用场景

- 身份证 OCR 表单自动录入
- 驾驶证 OCR 字段提取与校验
- 银行卡 OCR 识别与绑卡前校验
- 通用文本 OCR 提取手机号、邮箱、日期和关键词
- Web 端离线 OCR Demo、私有部署和本地识别流程

## 本地开发

```bash
npm install --cache .npm-cache --ignore-scripts
npm run dev --workspace @luciaocr/demo-react
```

## 文档入口

- Core SDK: [packages/sdk-core/README.md](./packages/sdk-core/README.md)
- Web SDK: [packages/sdk-web/README.md](./packages/sdk-web/README.md)
- React SDK: [packages/sdk-react/README.md](./packages/sdk-react/README.md)
- Vue SDK: [packages/sdk-vue/README.md](./packages/sdk-vue/README.md)
- Angular SDK: [packages/sdk-angular/README.md](./packages/sdk-angular/README.md)
- React Native SDK: [packages/sdk-react-native/README.md](./packages/sdk-react-native/README.md)
- React Demo: [apps/demo-react/README.md](./apps/demo-react/README.md)
- Vue Demo: [apps/demo-vue/README.md](./apps/demo-vue/README.md)
- Angular Demo: [apps/demo-angular/README.md](./apps/demo-angular/README.md)
- React Native Demo: [apps/demo-native/README.md](./apps/demo-native/README.md)

## License

[MIT](./LICENSE)
