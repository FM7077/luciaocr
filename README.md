# luciaocr

Offline OCR monorepo centered on shared parsing, a browser runtime, a React wrapper, and a React Native bridge.

## Packages

| Package | Role | Status |
| --- | --- | --- |
| `@luciaocr/core` | Shared parsers, validators, formatters, and error types | Ready |
| `@luciaocr/web` | Browser OCR runtime with bundled web assets | Ready |
| `@luciaocr/react` | React-friendly package built on top of `@luciaocr/web` | Ready |
| `@luciaocr/react-native` | React Native bridge and WebView integration | Not device-verified |

## Workspace Layout

```text
.
├── apps
│   ├── demo-native
│   └── demo-react
├── packages
│   ├── sdk-core
│   ├── sdk-react
│   ├── sdk-web
│   └── sdk-react-native
└── scripts
```

## Install

For React web apps:

```bash
npm install @luciaocr/react
```

For browser-only usage without React helpers:

```bash
npm install @luciaocr/web
```

For shared parsing utilities only:

```bash
npm install @luciaocr/core
```

## Usage

React package:

```jsx
import { initOCR, recognize, destroyOCR } from "@luciaocr/react";

await initOCR({
  assetBaseUrl: "/ocr-runtime/",
});

const result = await recognize(file, "idCard");
destroyOCR();
```

Browser package:

```js
import { createWebOCR } from "@luciaocr/web";

const ocr = createWebOCR({
  assetBaseUrl: "/ocr-runtime/",
});

await ocr.init();
const result = await ocr.recognize(file, "general");
ocr.destroy();
```

## Local Development

```bash
npm install --cache .npm-cache --ignore-scripts
npm run dev --workspace @luciaocr/demo-react
```

## Docs

- Core SDK: [packages/sdk-core/README.md](./packages/sdk-core/README.md)
- Web SDK: [packages/sdk-web/README.md](./packages/sdk-web/README.md)
- React SDK: [packages/sdk-react/README.md](./packages/sdk-react/README.md)
- React demo: [apps/demo-react/README.md](./apps/demo-react/README.md)

## License

[MIT](./LICENSE)
