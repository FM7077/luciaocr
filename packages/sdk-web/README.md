# @luciaocr/web

[English](./README.en.md)

`@luciaocr/web` 是面向浏览器的离线 OCR SDK，内置运行时资源和结构化解析流程，可直接用于身份证识别、驾驶证识别、银行卡识别和通用文本识别。它适合需要在前端本地完成 OCR 提取、OCR 校验和结构化输出的 Web 项目。

## 特性

- 浏览器端离线 OCR，无需在线接口
- 内置运行时资源与默认资源解析逻辑
- 支持 `general`、`idCard`、`bankCard`、`driverLicense`
- 直接返回结构化结果，便于字段提取和表单回填
- 支持自定义资源路径、超时和初始化进度回调

## 安装

```bash
npm install @luciaocr/web
```

## 快速开始

```js
import { initOCR, recognize, destroyOCR } from "@luciaocr/web";

await initOCR({
  assetBaseUrl: "/ocr-runtime/",
  onProgress(message) {
    console.log(message);
  },
});

const result = await recognize(file, "idCard");
console.log(result);

destroyOCR();
```

## 独立实例

```js
import { createWebOCR } from "@luciaocr/web";

const ocr = createWebOCR({
  recognizeTimeout: 60000,
});

await ocr.init();
const bankCard = await ocr.recognize(file, "bankCard");
ocr.destroy();
```

## 支持的识别模板

- `general`
- `idCard`
- `bankCard`
- `driverLicense`

## 适用场景

- 浏览器端身份证 OCR
- 驾驶证 OCR 字段提取
- 银行卡 OCR 识别与校验
- 通用文本 OCR 后结构化处理

## 发布文档

- 快速开始：[docs/QUICKSTART.md](./docs/QUICKSTART.md)
- API 文档：[docs/API.md](./docs/API.md)
- 资源配置：[docs/ASSETS.md](./docs/ASSETS.md)
- 最小示例：[docs/EXAMPLES.md](./docs/EXAMPLES.md)
- 常见错误排查：[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- 变更记录：[CHANGELOG.md](./CHANGELOG.md)
- 第三方资源说明：[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)

## License

[MIT](../../LICENSE)
