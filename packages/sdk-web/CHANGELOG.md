# Changelog

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## 1.0.1 - 2026-04-22

Repacked `@fm7077/luciaocr-r` for npm publish after `1.0.0` was already used.

- bump package version to `1.0.1`
- refresh tarball for the next public publish

## 1.0.0 - 2026-04-21

Initial public release candidate for `@fm7077/luciaocr-r`.

- browser-only offline OCR SDK with bundled runtime assets
- built-in templates: `general`, `idCard`, `bankCard`, `driverLicense`
- stable public API: `initOCR`, `recognize`, `destroyOCR`, `createWebOCR`
- self-contained package build for standalone npm distribution
- packaged runtime assets: `onnx`, `wasm`, OCR dictionary, engine HTML/JS

## Versioning Policy

- follow semver
- `1.x` keeps the current public API and stable error codes compatible
- breaking runtime or API changes should ship in the next major version
