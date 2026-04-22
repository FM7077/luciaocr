# @luciaocr/react

[English](./README.en.md)

`@luciaocr/react` 是基于 `@luciaocr/web` 的 React 封装，适合在 React 项目中接入离线 OCR、身份证识别、驾驶证识别、银行卡识别和通用文本提取。

## 提供内容

- 重新导出 `@luciaocr/web` 的浏览器 OCR 能力
- `createReactOCR(options?)`
- `useOCR(options?)`

## 安装

```bash
npm install @luciaocr/react
```

## 示例

```jsx
import { useOCR } from "@luciaocr/react";

export default function OCRPanel() {
  const ocr = useOCR({
    assetBaseUrl: "/ocr-runtime/",
  });

  async function onPick(file) {
    await ocr.init();
    const result = await ocr.recognize(file, "idCard-CN");
    console.log(result);
  }

  return null;
}
```

## License

[MIT](../../LICENSE)
