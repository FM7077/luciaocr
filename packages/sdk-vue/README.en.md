# @luciaocr/vue

[简体中文](./README.md)

`@luciaocr/vue` is the Vue 3 wrapper built on top of `@luciaocr/web`. It is designed for Vue applications that need offline OCR, ID card recognition, driver license recognition, bank card recognition, and general text extraction.

## What It Provides

- Re-exports the browser OCR capability from `@luciaocr/web`
- `createVueOCR(options?)`
- `useOCR(options?)`

## Install

```bash
npm install @luciaocr/vue
```

## Example

```js
import { useOCR } from "@luciaocr/vue";

export default {
  setup() {
    const ocr = useOCR({
      assetBaseUrl: "/ocr-runtime/",
    });

    async function recognize(file) {
      await ocr.value.init();
      const result = await ocr.value.recognize(file, "bankCard");
      console.log(result);
    }

    return {
      recognize,
    };
  },
};
```

## License

[MIT](../../LICENSE)
