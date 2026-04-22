# @luciaocr/angular

[简体中文](./README.md)

`@luciaocr/angular` is the Angular wrapper built on top of `@luciaocr/web`. It is intended for Angular applications that need offline OCR, ID card recognition, driver license recognition, bank card recognition, and structured OCR extraction workflows.

## What It Provides

- Re-exports the browser OCR capability from `@luciaocr/web`
- `createAngularOCR(options?)`
- `provideLuciaocr(options?)`
- `injectLuciaocr()`

## Install

```bash
npm install @luciaocr/angular
```

## Example

```ts
import { provideLuciaocr, injectLuciaocr } from "@luciaocr/angular";

export const appProviders = [
  provideLuciaocr({
    assetBaseUrl: "/ocr-runtime/",
  }),
];

export function useOCRInAngular() {
  const ocr = injectLuciaocr();
  return ocr;
}
```

## License

[MIT](../../LICENSE)
