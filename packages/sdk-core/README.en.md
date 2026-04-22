# @luciaocr/core

[简体中文](./README.md)

`@luciaocr/core` is the logic-only core layer of `luciaocr`. It handles OCR result parsing, field extraction, rule-based validation, formatting, and the shared error model. It does not depend on the DOM, browsers, iframes, WebView, or React, so it can be reused in Node scripts, backend post-processing, tests, and host SDKs.

## Overview

- Parse `general`, `idCard`, `bankCard`, and `driverLicense`
- Extract phones, emails, dates, numbers, and keywords
- Validate ID card, bank card, and driver license related fields
- Provide the shared `OCRError` type

## Install

```bash
npm install @luciaocr/core
```

## Example

```js
import {
  parseIdCard,
  parseBankCard,
  parseDriverLicenseAuto,
  validateIdCard,
} from "@luciaocr/core";

const idCard = parseIdCard(text, lines);
const bankCard = parseBankCard(text);
const driverLicense = parseDriverLicenseAuto(text, lines);

console.log(idCard, bankCard, driverLicense);
console.log(validateIdCard(idCard.idNumber));
```

## Main Exports

- Parsers: `parseGeneral`, `parseIdCard`, `parseIdCardFront`, `parseIdCardBack`, `parseBankCard`, `parseDriverLicenseAuto`
- Detectors: `detectIdCardSide`, `detectDriverLicensePage`
- Extractors: `extractNumbersFromText`, `extractDatesFromText`, `extractEmailsFromText`, `extractPhonesFromText`
- Validators: `validateIdCard`, `validateBankCard`, `validateBankCardExpiry`, `validateDriverLicenseNumber`
- Utilities: `formatIdCard`, `formatBankCard`, `formatOCRResult`

## Use Cases

- OCR post-processing without bundling a recognition engine
- Structured extraction and validation for ID card OCR
- Bank card OCR checks for card number and expiry date
- Driver license OCR normalization and rule-based validation

## License

[MIT](../../LICENSE)
