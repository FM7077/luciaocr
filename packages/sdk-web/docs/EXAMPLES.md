# Web Example

GitHub: [`FM7077/luciaocr`](https://github.com/FM7077/luciaocr)

## Minimal HTML example

```html
<!doctype html>
<html lang="en">
  <body>
    <input id="file" type="file" accept="image/*" />
    <pre id="output"></pre>

    <script type="module">
import { initOCR, recognize } from "@luciaocr/web";

      const fileInput = document.getElementById("file");
      const output = document.getElementById("output");

      await initOCR();

      fileInput.addEventListener("change", async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        const result = await recognize(file, "general");
        output.textContent = JSON.stringify(result, null, 2);
      });
    </script>
  </body>
</html>
```
