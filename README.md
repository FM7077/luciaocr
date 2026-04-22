# luciaocr

Offline OCR monorepo centered on shared parsing, a browser runtime, framework wrappers, and a React Native bridge.

## Packages

| Package | Role | Status |
| --- | --- | --- |
| `@luciaocr/core` | Shared parsers, validators, formatters, and error types | Ready |
| `@luciaocr/web` | Browser OCR runtime with bundled web assets | Ready |
| `@luciaocr/react` | React-friendly package built on top of `@luciaocr/web` | Ready |
| `@luciaocr/vue` | Vue 3 friendly package built on top of `@luciaocr/web` | Ready |
| `@luciaocr/angular` | Angular-friendly package built on top of `@luciaocr/web` | Ready |
| `@luciaocr/react-native` | React Native bridge and WebView integration | Not device-verified |

## Workspace Layout

```text
.
├── apps
│   ├── demo-angular
│   ├── demo-native
│   ├── demo-react
│   └── demo-vue
├── packages
│   ├── sdk-angular
│   ├── sdk-core
│   ├── sdk-react
│   ├── sdk-react-native
│   ├── sdk-vue
│   └── sdk-web
└── scripts
```

## Install

React:

```bash
npm install @luciaocr/react
```

Vue 3:

```bash
npm install @luciaocr/vue
```

Angular:

```bash
npm install @luciaocr/angular
```

Browser-only:

```bash
npm install @luciaocr/web
```

Shared parsing only:

```bash
npm install @luciaocr/core
```

## Usage

React:

```jsx
import { initOCR, recognize, destroyOCR } from "@luciaocr/react";

await initOCR({
  assetBaseUrl: "/ocr-runtime/",
});

const result = await recognize(file, "idCard");
destroyOCR();
```

Vue 3:

```js
import { initOCR, recognize, destroyOCR } from "@luciaocr/vue";

await initOCR({
  assetBaseUrl: "/ocr-runtime/",
});

const result = await recognize(file, "idCard");
destroyOCR();
```

Angular:

```ts
import { provideLuciaocr, injectLuciaocr } from "@luciaocr/angular";
```

Browser-only:

```js
import { createWebOCR } from "@luciaocr/web";

const ocr = createWebOCR({
  assetBaseUrl: "/ocr-runtime/",
});

await ocr.init();
const result = await ocr.recognize(file, "general");
ocr.destroy();
```

## Vue 2 vs Vue 3

The repository now targets Vue 3 only.

Reasons:

- Vue 3 matches the current ESM and Vite-first structure
- it avoids carrying a second maintenance line for Vue 2
- modern composables map naturally to the existing `@luciaocr/web` API

## Local Development

```bash
npm install --cache .npm-cache --ignore-scripts
npm run dev --workspace @luciaocr/demo-react
```

## Docs

- Core SDK: [packages/sdk-core/README.md](./packages/sdk-core/README.md)
- Web SDK: [packages/sdk-web/README.md](./packages/sdk-web/README.md)
- React SDK: [packages/sdk-react/README.md](./packages/sdk-react/README.md)
- Vue SDK: [packages/sdk-vue/README.md](./packages/sdk-vue/README.md)
- Angular SDK: [packages/sdk-angular/README.md](./packages/sdk-angular/README.md)
- React demo: [apps/demo-react/README.md](./apps/demo-react/README.md)
- Vue demo: [apps/demo-vue/README.md](./apps/demo-vue/README.md)
- Angular demo: [apps/demo-angular/README.md](./apps/demo-angular/README.md)

## License

[MIT](./LICENSE)
