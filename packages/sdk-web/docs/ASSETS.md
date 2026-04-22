# Asset Configuration

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

`@luciaocr/web` includes its runtime assets inside the published package.

## Default behavior

- `ocr.html`, `onnx`, `wasm`, dictionary, and runtime scripts are loaded from the package `dist/runtime` directory
- consumers do not need to copy models manually when using the default package layout

## `assetBaseUrl`

Use `assetBaseUrl` when assets are hosted under a custom public path.

```js
await initOCR({
  assetBaseUrl: "/ocr-runtime/",
});
```

## `assetResolver`

Use `assetResolver` when asset URLs must be rewritten file by file.

```js
await initOCR({
  assetResolver({ path, defaultUrl }) {
    return path.startsWith("models/")
      ? `https://cdn.example.com/ocr/${path}`
      : defaultUrl;
  },
});
```

## Runtime asset inventory

- `ocr.html`
- `ort.min.js`
- `opencv.js`
- `esearch-ocr.js`
- `ort-wasm-simd-threaded*.wasm`
- `ort-wasm-simd-threaded*.mjs`
- `models/ppocr_det.onnx`
- `models/ppocr_rec.onnx`
- `models/ppocr_keys_v1.txt`
