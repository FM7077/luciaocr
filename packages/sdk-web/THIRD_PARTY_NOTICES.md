# Third-Party Notices

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

`@fm7077/luciaocr-r` redistributes third-party runtime assets required for offline OCR.

## Included runtime assets

- ONNX Runtime Web artifacts:
  - `ort.min.js`
  - `ort-wasm-simd-threaded.wasm`
  - `ort-wasm-simd-threaded.mjs`
  - `ort-wasm-simd-threaded.jsep.wasm`
  - `ort-wasm-simd-threaded.jsep.mjs`
- OpenCV Web artifact:
  - `opencv.js`
- OCR runtime and model assets:
  - `esearch-ocr.js`
  - `models/ppocr_det.onnx`
  - `models/ppocr_rec.onnx`
  - `models/ppocr_keys_v1.txt`

## Source lineage

- This project acknowledges the implementation lineage and packaging inspiration from
  [`ftcvictory/local-OCR`](https://github.com/ftcvictory/local-OCR).

## Maintainer review note

- Before `npm publish`, do a final manual license review for every redistributed runtime file,
  especially the OCR models, dictionary, ONNX Runtime Web artifacts, and OpenCV bundle.
- This repository currently documents the redistributed asset inventory, but does not yet embed
  each upstream license text inside this package.
