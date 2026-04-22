# @luciaocr/react-native

[简体中文](./README.md)

`@luciaocr/react-native` is the React Native runtime wrapper in `luciaocr`. It uses a hidden `WebView` to load the offline OCR runtime and enables mobile flows for ID card recognition, driver license recognition, bank card recognition, and general text OCR.

## What It Provides

- `ReactNativeOCR` controller
- `OCRWebView` hidden WebView container
- OCR runtime assets bundled with the package
- Initialization, recognition, and bridge messaging aligned with the Web SDK

## Peer Dependencies

- `react`
- `react-native`
- `react-native-webview`

## Metro Setup

The runtime includes `onnx`, `wasm`, `mjs`, `txt`, and `html` assets, so the host app must add them to Metro `assetExts`.

Reference: [apps/demo-native/metro.config.cjs](../../apps/demo-native/metro.config.cjs)

## Example

```jsx
import React from "react";
import { OCRWebView, createReactNativeOCR } from "@luciaocr/react-native";

const ocr = createReactNativeOCR();

export default function Screen() {
  return <OCRWebView controller={ocr} />;
}
```

## Notes

- This repository currently provides the React Native OCR wrapper and a demo skeleton
- A real device integration still needs a host Android/iOS project
- It is intended for offline OCR, field extraction, and validation in React Native apps

## License

[MIT](../../LICENSE)
