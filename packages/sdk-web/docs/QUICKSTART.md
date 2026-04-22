# Quick Start

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## Install

```bash
npm install @luciaocr/web
```

## Minimal usage

```js
import { initOCR, recognize, destroyOCR } from "@luciaocr/web";

await initOCR();

const file = document.querySelector("input[type=file]").files[0];
const result = await recognize(file, "general");

console.log(result);

destroyOCR();
```

## When to initialize

- initialize during app startup or page idle time
- reuse the same initialized instance for repeated recognitions
- call `destroyOCR()` when the page no longer needs OCR
