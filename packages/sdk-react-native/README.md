# @fm7077/lucaiocr-rn

React Native runtime package for `luciaocr`.

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## Acknowledgement

This package is part of the React-oriented refactor of
[`ftcvictory/local-OCR`](https://github.com/ftcvictory/local-OCR),
with the React Native bridge and packaging adapted on top of that offline OCR foundation.

## What it provides

- `ReactNativeOCR` controller with the same public lifecycle as `sdk-web`
- `OCRWebView` reusable hidden WebView container
- OCR runtime assets bundled inside the package
- bridge protocol aligned with `sdk-web`:
  - `OCR_READY`
  - `OCR_PROGRESS`
  - `OCR_RESULT`
  - `OCR_ERROR`
  - `RECOGNIZE_REQUEST`

## Peer dependencies

- `react`
- `react-native`
- `react-native-webview`

## Metro setup

Because the runtime includes `onnx`, `wasm`, `mjs`, `txt`, and `html` assets, the host app must add them to Metro `assetExts`.

See `apps/demo-native/metro.config.cjs` for the expected setup.

## Minimal usage

```jsx
import React from "react";
import { OCRWebView, createReactNativeOCR } from "@fm7077/lucaiocr-rn";

const ocr = createReactNativeOCR();

export default function Screen() {
  return <OCRWebView controller={ocr} />;
}
```
