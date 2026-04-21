# @fm7077/demo-native

React Native demo app skeleton for `@fm7077/lucaiocr-rn`.

## Acknowledgement

This demo is built around the React Native adaptation of the offline OCR workflow
inspired by [`ftcvictory/local-OCR`](https://github.com/ftcvictory/local-OCR).

## Included

- hidden `OCRWebView` mount
- image selection via `react-native-image-picker`
- OCR init status, recognition action, result rendering, and copy action
- Metro asset extension setup for OCR runtime assets

## Notes

- this workspace app is a source-level demo skeleton, not a fully bootstrapped RN CLI project
- before running on device, the host app should include:
  - Android/iOS project folders
  - `react-native-webview`
  - `react-native-image-picker`
  - `@react-native-clipboard/clipboard`
- Metro must include `onnx`, `wasm`, `mjs`, `txt`, and `html` in `assetExts`
