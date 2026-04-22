# Troubleshooting

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## `ENGINE_INIT_FAILED`

Common causes:

- runtime assets are missing
- `assetBaseUrl` points to the wrong directory
- the browser blocks loading local or cross-origin assets

## `ASSET_LOAD_FAILED`

Common causes:

- model or dictionary files are not deployed
- custom asset rewriting returns a broken URL

## `RECOGNIZE_TIMEOUT`

Common causes:

- the image is too large
- runtime initialization has not completed
- the browser tab is under heavy load

## `BRIDGE_ERROR`

Common causes:

- the hidden iframe could not be created
- OCR calls were made in a non-browser environment

## Slow first load

This package ships large OCR models and wasm assets. The first initialization is expected to be much slower than subsequent recognitions.
