# Project Decisions

## 0. Project Decision Freeze

Date: 2026-04-21

### Package naming and release order

- npm scope is frozen as `@lf-ocr`
- package names are frozen as `@fm7077/luciaocr-core`, `@fm7077/luciaocr-r`, and `@fm7077/lucaiocr-rn`
- initial release order is frozen as `sdk-core` first, then `sdk-web`, then `sdk-react-native`

### Workspace structure

- workspace structure is frozen as:
  - `packages/sdk-core`
  - `packages/sdk-web`
  - `packages/sdk-react-native`
  - `apps/demo-web`
  - `apps/demo-native`
- the existing root `uni-app` project and `uni_modules/lf-OCR` are treated as legacy runtime code during migration
- workspace packages must not depend on root `uni-app` files to build

### Asset distribution strategy

- initial asset strategy is frozen as "hosted by each runtime package"
- `sdk-web` and `sdk-react-native` each carry the OCR runtime assets they need
- a standalone `ocr-assets` package is explicitly deferred until asset reuse becomes a real maintenance problem

### Initial release scope

- initial release scope is frozen as `sdk-core` + `sdk-web`
- `sdk-react-native` stays in workspace but is not part of the first public release

### Minimal public API

- runtime API is frozen as:
  - `initOCR`
  - `recognize`
  - `destroyOCR`
  - `getVersion`
  - `isInitialized`
- parser API is frozen as:
  - `parseGeneral`
  - `parseIdCard`
  - `parseBankCard`
  - `parseDriverLicense`

### Template and result field naming

- template names are frozen as `general`, `idCard`, `bankCard`, and `driverLicense`
- shared result fields are frozen as `text`, `rawText`, `lines`, `duration`, and `valid`
- document-specific compatibility fields are frozen as:
  - `side` for `idCard`
  - `page` for `driverLicense`
  - `isExpired` where validity period exists
- current field names in the extracted parsing layer are treated as the compatibility baseline for later SDK work
