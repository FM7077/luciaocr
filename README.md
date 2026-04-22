# luciaocr

> 基于 PaddleOCR 的离线 OCR monorepo，当前以 React Web SDK 为主，提供结构化证件识别与纯文本解析能力

## 致敬来源

本仓库的离线 OCR 方案、运行时资源组织思路与早期实现演进，致敬来源项目
[`ftcvictory/local-OCR`](https://github.com/ftcvictory/local-OCR)。

## 特性

- 纯前端离线 OCR，无需联网
- 内置 PaddleOCR Web 运行时资源：`onnx`、`wasm`、字典、引擎脚本
- 支持 `general`、`idCard`、`bankCard`、`driverLicense`
- 返回结构化结果，包含 `valid`、`isExpired`、`side/page` 等关键字段
- 提供可单独复用的解析核心包和浏览器 SDK
- 自带 React Web demo 用于验证资源加载、初始化、识别和结果展示

## 当前状态

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| `@luciaocr/luciaocr-r` | 已验证 | React Web / 浏览器侧已完成构建、类型检查、测试和 demo 验证 |
| `@luciaocr/luciaocr-core` | 已验证 | 纯解析逻辑已拆分并覆盖基础单元测试与回归夹具 |
| `@luciaocr/lucaiocr-rn` / `demo-native` | 未实机验证 | 代码仍保留，但 React Native 目前**未经 Android/iOS 实机测试** |

## 仓库结构

```text
.
├── apps
│   ├── demo-web
│   └── demo-native
├── packages
│   ├── sdk-core
│   ├── sdk-react
│   └── sdk-react-native
└── scripts
```

### 包说明

- `packages/sdk-core`
  纯逻辑层，提供模板解析、校验器、格式化工具和统一错误模型
- `packages/sdk-react`
浏览器 OCR SDK，项目名为 `sdk-react`，对外发布为 `@luciaocr/luciaocr-r`
- `packages/sdk-react-native`
  React Native 适配层，当前保留源码，但未经实机验证
- `apps/demo-web`
React + Vite demo，用于验证 `@luciaocr/luciaocr-r`
- `apps/demo-native`
  React Native demo 骨架，当前仅保留源码结构

## 平台支持

| 平台 | 支持情况 | 说明 |
| --- | --- | --- |
| React Web / Browser | ✅ | 已验证 |
| React Native Android | ⚠️ | 代码存在，但**未经实机测试** |
| React Native iOS | ⚠️ | 代码存在，但**未经实机测试** |
| uni-app / 小程序 | ❌ | 旧实现已从当前源码主线移除 |

## 安装

如果你只需要 Web SDK：

```bash
npm install @luciaocr/luciaocr-r
```

如果你在本仓库里开发：

```bash
npm install --legacy-peer-deps
```

说明：
- 这里使用 `--legacy-peer-deps`，是为了绕过当前仓库中 React Native 依赖的 peer conflict
- React Web 相关内容已经可用，不依赖 RN 路径

## Web 使用方式

### 方式一：直接使用默认 SDK 方法

```js
import { initOCR, recognize, destroyOCR } from "@luciaocr/luciaocr-r";

await initOCR({
  onProgress(message) {
    console.log("初始化进度:", message);
  },
});

const file = document.querySelector("input[type=file]").files[0];
const result = await recognize(file, "idCard");

console.log(result);

destroyOCR();
```

### 方式二：创建独立实例

```js
import { createWebOCR } from "@luciaocr/luciaocr-r";

const ocr = createWebOCR({
  assetBaseUrl: "/ocr-runtime/",
});

await ocr.init();

const result = await ocr.recognize(
  "https://example.com/sample-id-card.jpg",
  "idCard"
);

console.log(result);

ocr.destroy();
```

### 方式三：使用默认导出实例

```js
import ocr from "@luciaocr/luciaocr-r";

await ocr.init();
const result = await ocr.recognize("data:image/png;base64,...", "general");
console.log(result);
ocr.destroy();
```

## 公开 API

### 浏览器 SDK

`@luciaocr/luciaocr-r` 当前对外暴露：

- `initOCR(options?)`
- `recognize(input, template?, options?)`
- `destroyOCR()`
- `getVersion()`
- `isInitialized()`
- `createWebOCR(options?)`
- `runtimeAssets`

支持模板：

```js
"general" | "idCard" | "bankCard" | "driverLicense"
```

### 解析核心

`@luciaocr/luciaocr-core` 当前对外提供：

- `parseGeneral`
- `parseIdCard`
- `parseBankCard`
- `parseDriverLicenseAuto`
- 校验器：`validateIdCard`、`validateBankCard`、`validatePhone` 等
- 格式化工具：`formatDate`、`formatBankCard`、`formatDuration` 等
- 错误模型：`OCRError`

## 返回结果示例

### 身份证

```js
{
  valid: true,
  side: "front",
  name: "张三",
  gender: "男",
  birthDate: "1990年01月01日",
  address: "北京市朝阳区某某街道123号",
  idNumber: "110101199001011234"
}
```

### 银行卡

```js
{
  valid: true,
  cardNumber: "6228480402564890018",
  bankName: "中国农业银行",
  cardType: "借记卡",
  expiryDate: "12/99",
  isExpired: false
}
```

### 驾驶证

```js
{
  valid: true,
  page: "main",
  name: "张三",
  licenseClass: "C1",
  licenseClassDesc: "小型汽车",
  validPeriod: {
    start: "2020.05.06",
    end: "2030.05.06"
  }
}
```

## 错误码

当前稳定错误码包括：

- `ASSET_LOAD_FAILED`
- `ENGINE_INIT_FAILED`
- `UNSUPPORTED_IMAGE_SOURCE`
- `RECOGNIZE_TIMEOUT`
- `BRIDGE_ERROR`
- `PARSE_ERROR`

## 本地开发

### 运行 demo-web

```bash
cd apps/demo-web
npm run dev -- --host 127.0.0.1 --port 5174
```

默认本地访问地址：

```text
http://127.0.0.1:5174/
```

### 工作区脚本

在仓库根目录可用：

```bash
npm run build
npm run test
npm run typecheck
npm run release:check
```

## 测试覆盖

当前已经覆盖的内容包括：

- `sdk-core` 单元测试
- 身份证正反面解析
- 银行卡解析与有效期
- 驾驶证主页解析
- 通用文本中的电话、邮箱、日期提取
- 每种模板 3 组文本回归样本：正常、模糊、错误类型
- `sdk-react` 初始化成功/失败
- `sdk-react` 文件/Blob 输入识别成功
- `sdk-react` 资源加载失败与识别超时错误路径

尚未完成的重点：

- React Native 实机验证
- Web / RN 同样本字段一致性验证
- 发布前 tarball 回装验证与文档完善

## 文档入口

- Web SDK 说明：[packages/sdk-react/README.md](./packages/sdk-react/README.md)
- Web demo 说明：[apps/demo-web/README.md](./apps/demo-web/README.md)

## License

[MIT](./LICENSE)
