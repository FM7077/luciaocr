# @luciaocr/demo-native

[简体中文](./README.md)

`@luciaocr/demo-native` is the React Native demo skeleton for `@luciaocr/react-native`. It is used to validate the hidden `OCRWebView` mount, image picking flow, OCR initialization status, result rendering, and copy action.

## Notes

- This is a source-level demo skeleton, not a complete React Native CLI project
- A real Android/iOS host project is still required before device testing
- It expects `react-native-webview`, `react-native-image-picker`, and `@react-native-clipboard/clipboard`
- Metro must include `onnx`, `wasm`, `mjs`, `txt`, and `html` in asset extensions
