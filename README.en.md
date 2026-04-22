# luciaocr

[简体中文](./README.md)

`luciaocr` is an offline OCR monorepo for frontend and cross-platform use cases. It is built around OCR recognition, field extraction, rule-based validation, structured output, and SDK wrappers for multiple runtimes. The repository focuses on ID card OCR, driver license OCR, bank card OCR, and general text OCR, with support for browsers, React, Vue, Angular, and React Native.

If you are looking for an offline OCR SDK for ID card recognition, driver license recognition, bank card recognition, OCR extraction, OCR validation, browser OCR, Web OCR, or frontend OCR workflows, this repository is organized around those exact capabilities.

## Core Capabilities

- Offline OCR that runs in the browser without calling an online recognition API
- Document recognition for ID cards, driver licenses, bank cards, and general text
- Field extraction for names, ID numbers, card numbers, expiry dates, addresses, license classes, phone numbers, emails, dates, and more
- Result validation for ID numbers, bank card numbers, bank card expiry dates, driver license fields, and related formats
- Structured output designed for form autofill, review workflows, risk control, and downstream processing
- Multi-layer SDKs for `core`, `web`, `react`, `vue`, `angular`, and `react-native`

## Key OCR Scenarios

### ID Card OCR

- Recognize common fields from Chinese ID cards
- Extract name, gender, ethnicity, birth date, address, and ID number
- Detect front and back sides
- Validate ID numbers and validity periods

### Driver License OCR

- Recognize driver license pages and related fields
- Extract name, gender, nationality, address, birth date, first issue date, license class, license number, and validity period
- Detect the page type
- Validate license number, archive number, license class, and validity period

### Bank Card OCR

- Extract card number, bank name, card type, expiry date, and cardholder details
- Clean OCR noise and whitespace from recognized text
- Validate bank card numbers and expiry dates
- Use the output for card-binding forms, payment review, and OCR post-processing

## Packages

| Package | Role | Status |
| --- | --- | --- |
| `@luciaocr/core` | Shared parsers, validators, formatters, and error types | Ready |
| `@luciaocr/web` | Browser offline OCR runtime and structured recognition entry point | Ready |
| `@luciaocr/react` | React wrapper built on top of `@luciaocr/web` | Ready |
| `@luciaocr/vue` | Vue 3 wrapper built on top of `@luciaocr/web` | Ready |
| `@luciaocr/angular` | Angular wrapper built on top of `@luciaocr/web` | Ready |
| `@luciaocr/react-native` | React Native bridge and runtime integration via WebView | Not device-verified |

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

Parsing and validation only:

```bash
npm install @luciaocr/core
```

## Quick Start

### Browser OCR

```js
import { createWebOCR } from "@luciaocr/web";

const ocr = createWebOCR({
  assetBaseUrl: "/ocr-runtime/",
});

await ocr.init();

const idCardResult = await ocr.recognize(file, "idCard-CN");
const bankCardResult = await ocr.recognize(file, "bankCard");
const driverLicenseResult = await ocr.recognize(file, "driverLicense-CN");

console.log(idCardResult, bankCardResult, driverLicenseResult);

ocr.destroy();
```

### Extraction and Validation Only

```js
import {
  parseIdCard,
  parseBankCard,
  parseDriverLicenseAuto,
  validateIdCard,
  validateBankCard,
} from "@luciaocr/core";

const idCard = parseIdCard(rawText, lines);
const bankCard = parseBankCard(rawText);
const driverLicense = parseDriverLicenseAuto(rawText, lines);

console.log(validateIdCard(idCard.idNumber));
console.log(validateBankCard(bankCard.cardNumber));
```

## Typical Output

ID card OCR result:

```js
{
  valid: true,
  side: "front",
  name: "Zhang San",
  gender: "Male",
  ethnicity: "Han",
  birthDate: "1949-12-31",
  address: "No. 88 Jianguo Road, Chaoyang District, Beijing",
  idNumber: "11010519491231002X"
}
```

Bank card OCR result:

```js
{
  valid: true,
  bankName: "Agricultural Bank of China",
  cardNumber: "6228480402564890018",
  cardNumberFormatted: "6228 4804 0256 4890 018",
  expiryDate: "12/99",
  isExpired: false
}
```

Driver license OCR result:

```js
{
  valid: true,
  page: "main",
  name: "Zhang San",
  nationality: "China",
  licenseClass: "C1",
  validPeriod: {
    start: "2020.05.06",
    end: "2030.05.06"
  }
}
```

## Use Cases

- ID card OCR for form autofill
- Driver license OCR for field extraction and validation
- Bank card OCR for card-binding and pre-check workflows
- General text OCR for phone, email, date, and keyword extraction
- Offline OCR demos, private deployment, and local-first browser flows

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
- React Native SDK: [packages/sdk-react-native/README.md](./packages/sdk-react-native/README.md)
- React Demo: [apps/demo-react/README.md](./apps/demo-react/README.md)
- Vue Demo: [apps/demo-vue/README.md](./apps/demo-vue/README.md)
- Angular Demo: [apps/demo-angular/README.md](./apps/demo-angular/README.md)
- React Native Demo: [apps/demo-native/README.md](./apps/demo-native/README.md)

## License

[MIT](./LICENSE)
