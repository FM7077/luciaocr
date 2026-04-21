# API

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## `initOCR(options?)`

Initializes the hidden iframe runtime and loads OCR assets.

## `recognize(input, template?, options?)`

Recognizes a single image and returns structured JSON.

Supported `input` values:

- image URL string
- data URL string
- `File`
- `Blob`

Supported `template` values:

- `general`
- `idCard`
- `bankCard`
- `driverLicense`

## `destroyOCR()`

Destroys the default OCR instance and hidden iframe.

## `createWebOCR(options?)`

Creates an isolated OCR controller when you do not want to use the default singleton.

## `runtimeAssets`

Returns the packaged runtime asset manifest for diagnostics and custom hosting.
