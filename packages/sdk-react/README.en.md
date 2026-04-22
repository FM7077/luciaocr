# @luciaocr/react

[简体中文](./README.md)

`@luciaocr/react` is the React wrapper built on top of `@luciaocr/web`. It is intended for React applications that need offline OCR, ID card recognition, driver license recognition, bank card recognition, and general text extraction.

## What It Provides

- Re-exports the browser OCR capability from `@luciaocr/web`
- `createReactOCR(options?)`
- `useOCR(options?)`

## Install

```bash
npm install @luciaocr/react
```

## Example

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
