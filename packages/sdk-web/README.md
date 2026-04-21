# @fm7077/luciaocr-r

> 面向浏览器的离线 OCR SDK，内置 PaddleOCR 运行时资源与结构化解析能力

GitHub：[`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## 致敬来源

本包的离线 OCR 运行时封装与资源组织思路，致敬来源项目
[`ftcvictory/local-OCR`](https://github.com/ftcvictory/local-OCR)。

## 特性

- 纯前端离线识别，无需联网
- 内置 OCR 运行时资源，无需自己管理 `onnx`、`wasm`、字典和引擎脚本
- 支持 `general`、`idCard`、`bankCard`、`driverLicense`
- 自动返回结构化结果，不需要单独再接 `sdk-core`
- 支持默认资源路径和自定义资源路径

## 安装

```bash
npm install @fm7077/luciaocr-r
```

如果你是从源码工作区联调，也可以直接使用 workspace 包。

## 发布文档

- 快速开始：[docs/QUICKSTART.md](./docs/QUICKSTART.md)
- API 文档：[docs/API.md](./docs/API.md)
- 资源配置：[docs/ASSETS.md](./docs/ASSETS.md)
- 最小示例：[docs/EXAMPLES.md](./docs/EXAMPLES.md)
- 常见错误排查：[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- 变更记录：[CHANGELOG.md](./CHANGELOG.md)
- 第三方资源说明：[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)

说明：
- 当前发布包已经做成单包可分发，安装 `@fm7077/luciaocr-r` 时不需要额外安装 `@fm7077/luciaocr-core`

## 使用方式

### 方式一：直接使用默认 SDK 方法

这是最直接的接入方式，适合大多数 Web 项目。

```js
import { initOCR, recognize, destroyOCR } from "@fm7077/luciaocr-r";

await initOCR({
  onProgress(message) {
    console.log("初始化进度:", message);
  },
});

const file = document.querySelector("input[type=file]").files[0];
const result = await recognize(file, "idCard");

console.log("识别结果:", result);

destroyOCR();
```

### 方式二：创建独立实例

如果你的页面里需要多个独立 OCR 实例，或者你不想使用默认单例，可以使用 `createWebOCR`。

```js
import { createWebOCR } from "@fm7077/luciaocr-r";

const ocr = createWebOCR({
  onProgress(message) {
    console.log("OCR:", message);
  },
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

如果你习惯以对象方式调用，也可以直接使用默认导出。

```js
import ocr from "@fm7077/luciaocr-r";

await ocr.init();

const result = await ocr.recognize(
  "https://example.com/bank-card.jpg",
  "bankCard"
);

console.log(result);

ocr.destroy();
```

## React 示例

```jsx
import { useEffect, useState } from "react";
import { destroyOCR, initOCR, recognize } from "@fm7077/luciaocr-r";

export default function OCRDemo() {
  const [status, setStatus] = useState("等待初始化");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let disposed = false;

    initOCR({
      onProgress(message) {
        if (!disposed) {
          setStatus(message);
        }
      },
    })
      .then(() => {
        if (!disposed) {
          setStatus("OCR 引擎已就绪");
        }
      })
      .catch((error) => {
        if (!disposed) {
          setStatus(error.message || "初始化失败");
        }
      });

    return () => {
      disposed = true;
      destroyOCR();
    };
  }, []);

  async function onPickFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const nextResult = await recognize(file, "general");
    setResult(nextResult);
  }

  return (
    <div>
      <p>{status}</p>
      <input type="file" accept="image/*" onChange={onPickFile} />
      <pre>{result ? JSON.stringify(result, null, 2) : "暂无结果"}</pre>
    </div>
  );
}
```

## 初始化参数

`initOCR(options)` 和 `createWebOCR(options)` 支持以下参数：

```ts
{
  assetBaseUrl?: string;
  assetResolver?: (input: {
    type: "runtime";
    path: string;
    defaultUrl: string;
  }) => string;
  initTimeout?: number;
  recognizeTimeout?: number;
  onProgress?: (message: string) => void;
}
```

### `assetBaseUrl`

用于指定 OCR 运行时资源所在目录。适合你把静态资源托管到自定义目录或 CDN 的场景。

```js
import { initOCR } from "@fm7077/luciaocr-r";

await initOCR({
  assetBaseUrl: "/ocr-runtime/",
});
```

### `assetResolver`

如果你希望按文件逐个改写资源地址，可以使用 `assetResolver`。

```js
await initOCR({
  assetResolver({ path, defaultUrl }) {
    if (path.startsWith("models/")) {
      return `https://cdn.example.com/lf-ocr/${path}`;
    }

    return defaultUrl;
  },
});
```

## 识别方法

```js
const result = await recognize(input, template, options);
```

### `input`

支持以下输入：

- 图片 URL
- base64 / data URL 字符串
- `File`
- `Blob`

### `template`

支持以下模板：

```js
"general" | "idCard" | "bankCard" | "driverLicense"
```

### `options`

```js
{
  recognizeTimeout?: number;
}
```

## API 文档

### `initOCR(options?)`

初始化 OCR 引擎。

### `recognize(input, template?, options?)`

执行识别并返回结构化结果。

### `destroyOCR()`

销毁默认实例及隐藏 iframe。

### `getVersion()`

返回当前 SDK 版本号。

### `isInitialized()`

返回默认实例当前是否已初始化。

### `createWebOCR(options?)`

创建新的 `WebOCR` 实例。

### `runtimeAssets`

返回 SDK 内置运行时资源清单：

```js
{
  engineHtml: "ocr.html",
  scripts: ["ort.min.js", "opencv.js", "esearch-ocr.js"],
  wasm: [
    "ort-wasm-simd-threaded.wasm",
    "ort-wasm-simd-threaded.mjs",
    "ort-wasm-simd-threaded.jsep.wasm",
    "ort-wasm-simd-threaded.jsep.mjs"
  ],
  models: [
    "models/ppocr_det.onnx",
    "models/ppocr_rec.onnx",
    "models/ppocr_keys_v1.txt"
  ]
}
```

## 返回结果

### 通用文本

```js
{
  valid: true,
  rawText: "联系电话 13800138000",
  text: "联系电话 13800138000",
  lines: ["联系电话 13800138000"],
  cleanText: "联系电话 13800138000",
  extracted: {
    phones: [{ number: "13800138000", type: "mobile" }]
  }
}
```

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

SDK 统一使用 `OCRError`，当前稳定错误码包括：

- `ASSET_LOAD_FAILED`
- `ENGINE_INIT_FAILED`
- `UNSUPPORTED_IMAGE_SOURCE`
- `RECOGNIZE_TIMEOUT`
- `BRIDGE_ERROR`
- `PARSE_ERROR`

## 注意事项

- 该 SDK 运行在浏览器环境，内部通过隐藏 `iframe` 挂载 OCR 引擎
- 首次初始化会加载较大的模型和 `wasm` 资源，建议在页面空闲期提前初始化
- 如果你部署在子路径下，建议显式传入 `assetBaseUrl`
- 当前未提供 React 专用封装层，React 项目直接调用 SDK 即可
