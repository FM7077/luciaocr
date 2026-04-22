# @luciaocr/web

[简体中文](./README.md)

`@luciaocr/web` is the browser-facing offline OCR SDK in the `luciaocr` workspace. It bundles the runtime assets and the structured parsing flow required for ID card recognition, driver license recognition, bank card recognition, and general text OCR. It is designed for Web projects that need local OCR extraction, OCR validation, and structured output in the browser.

## Features

- Offline OCR in the browser without an online API
- Bundled runtime assets with default asset resolution
- Support for `general`, `idCard`, `bankCard`, and `driverLicense`
- Structured results for field extraction and form autofill
- Configurable asset paths, timeouts, and progress callbacks

## Install

```bash
npm install @luciaocr/web
```

## Quick Start

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

## Dedicated Instance

```js
import { createWebOCR } from "@luciaocr/web";

const ocr = createWebOCR({
  recognizeTimeout: 60000,
});

await ocr.init();
const bankCard = await ocr.recognize(file, "bankCard");
ocr.destroy();
```

## Supported Templates

- `general`
- `idCard`
- `bankCard`
- `driverLicense`

## Use Cases

- Browser-based ID card OCR
- Driver license OCR field extraction
- Bank card OCR recognition and validation
- Structured post-processing for general text OCR

## Published Docs

- Quickstart: [docs/QUICKSTART.md](./docs/QUICKSTART.md)
- API: [docs/API.md](./docs/API.md)
- Assets: [docs/ASSETS.md](./docs/ASSETS.md)
- Examples: [docs/EXAMPLES.md](./docs/EXAMPLES.md)
- Troubleshooting: [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- Changelog: [CHANGELOG.md](./CHANGELOG.md)
- Third-party notices: [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)

## License

[MIT](../../LICENSE)
