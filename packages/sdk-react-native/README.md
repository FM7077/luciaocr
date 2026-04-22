# @luciaocr/react-native

[English](./README.en.md)

`@luciaocr/react-native` 是 `luciaocr` 的 React Native 运行时封装，通过隐藏 `WebView` 加载离线 OCR 运行时，实现移动端身份证识别、驾驶证识别、银行卡识别和通用文本 OCR 识别。

## 提供内容

- `ReactNativeOCR` 控制器
- `OCRWebView` 隐藏式 WebView 容器
- 打包进包内的 OCR 运行时资源
- 与 Web 版本对齐的初始化、识别和桥接消息协议

## Peer Dependencies

- `react`
- `react-native`
- `react-native-webview`

## Metro 配置

运行时包含 `onnx`、`wasm`、`mjs`、`txt` 和 `html` 资源，宿主应用需要把它们加入 Metro 的 `assetExts`。

可参考：[apps/demo-native/metro.config.cjs](../../apps/demo-native/metro.config.cjs)

## 示例

```jsx
import React from "react";
import { OCRWebView, createReactNativeOCR } from "@luciaocr/react-native";

const ocr = createReactNativeOCR();

export default function Screen() {
  return <OCRWebView controller={ocr} />;
}
```

## 说明

- 当前仓库提供的是 React Native OCR 封装与示例骨架
- 真机集成前仍需准备宿主 App 的 Android/iOS 工程
- 适合做离线 OCR、OCR 字段提取和 OCR 校验的跨端接入

## License

[MIT](../../LICENSE)
