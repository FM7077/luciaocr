import test from "node:test";
import assert from "node:assert/strict";

import {
  SDK_WEB_VERSION,
  WebOCR,
  createWebOCR,
  destroyOCR,
  getVersion,
  isInitialized,
  recognize,
  runtimeAssets,
} from "../src/index.js";

function createFakeBrowserEnv() {
  const listeners = new Map();
  const iframe = {
    style: {},
    contentWindow: {},
    contentDocument: { readyState: "complete" },
    setAttribute() {},
    addEventListener(type, handler) {
      this[`on_${type}`] = handler;
    },
    removeEventListener(type, handler) {
      if (this[`on_${type}`] === handler) {
        delete this[`on_${type}`];
      }
    },
    remove() {
      this.removed = true;
    },
  };

  const windowMock = {
    location: { href: "http://localhost/demo" },
    addEventListener(type, handler) {
      const handlers = listeners.get(type) || new Set();
      handlers.add(handler);
      listeners.set(type, handlers);
    },
    removeEventListener(type, handler) {
      const handlers = listeners.get(type);
      if (handlers) {
        handlers.delete(handler);
      }
    },
  };

  const documentMock = {
    baseURI: "http://localhost/demo",
    body: {
      appendChild(node) {
        this.lastChild = node;
      },
    },
    createElement(tagName) {
      assert.equal(tagName, "iframe");
      return iframe;
    },
  };

  return { iframe, windowMock, documentMock };
}

async function withBrowserGlobals(callback) {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  try {
    const env = createFakeBrowserEnv();
    globalThis.window = env.windowMock;
    globalThis.document = env.documentMock;
    return await callback(env);
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
}

test("runtime manifest exposes stable asset groups", () => {
  assert.equal(runtimeAssets.engineHtml, "ocr.html");
  assert.deepEqual(runtimeAssets.scripts, [
    "ort.min.js",
    "opencv.js",
    "esearch-ocr.js",
  ]);
  assert.equal(runtimeAssets.models.length, 3);
});

test("sdk exports a reusable WebOCR instance contract", () => {
  const instance = createWebOCR({
    assetBaseUrl: "/ocr-runtime/",
    initTimeout: 1234,
    recognizeTimeout: 5678,
  });

  assert.ok(instance instanceof WebOCR);
  assert.equal(instance.getVersion(), SDK_WEB_VERSION);
  assert.equal(instance.isInitialized(), false);
});

test("init succeeds when the engine reports OCR_READY", async () => {
  await withBrowserGlobals(async ({ iframe, documentMock }) => {
    const instance = createWebOCR({
      assetBaseUrl: "/ocr-runtime/",
      initTimeout: 50,
    });

    instance.postToFrame = (message) => {
      if (message.type === "OCR_INIT") {
        queueMicrotask(() => {
          instance.handleMessage({
            source: iframe.contentWindow,
            data: {
              source: "luciaocr-web-engine",
              type: "OCR_READY",
            },
          });
        });
      }
    };

    await instance.init();

    assert.equal(instance.isInitialized(), true);
    assert.equal(documentMock.body.lastChild, instance.iframe);
    instance.destroy();
  });
});

test("init surfaces engine load failures with ENGINE_INIT_FAILED", async () => {
  await withBrowserGlobals(async ({ iframe }) => {
    const instance = createWebOCR({
      assetBaseUrl: "/ocr-runtime/",
      initTimeout: 50,
    });

    instance.postToFrame = (message) => {
      if (message.type === "OCR_INIT") {
        queueMicrotask(() => {
          instance.handleMessage({
            source: iframe.contentWindow,
            data: {
              source: "luciaocr-web-engine",
              type: "OCR_ERROR",
              message: "Failed to load OCR detection model",
            },
          });
        });
      }
    };

    await assert.rejects(() => instance.init(), (error) => {
      assert.equal(error.code, "ENGINE_INIT_FAILED");
      assert.match(error.message, /Failed to load OCR detection model/);
      return true;
    });
  });
});

test("recognize rejects before initialization with a stable error code", async () => {
  await assert.rejects(
    () => recognize("https://example.com/test.png", "general"),
    (error) => {
      assert.equal(error.code, "ENGINE_INIT_FAILED");
      return true;
    }
  );
});

test("recognize succeeds from a Blob/File-like image input", async () => {
  const originalFileReader = globalThis.FileReader;

  try {
    globalThis.FileReader = class MockFileReader {
      readAsDataURL(blob) {
        this.result = `data:${blob.type || "image/png"};base64,ZmFrZQ==`;
        queueMicrotask(() => this.onload?.());
      }
    };

    const instance = createWebOCR();
    instance.isReady = true;
    instance.iframe = {
      contentWindow: {},
      remove() {},
    };

    instance.postToFrame = (message) => {
      assert.equal(message.type, "OCR_RECOGNIZE");
      assert.match(message.imageSrc, /^data:image\/png;base64,/);

      queueMicrotask(() => {
        instance.handleMessage({
          source: instance.iframe.contentWindow,
          data: {
            source: "luciaocr-web-engine",
            type: "OCR_RESULT",
            requestId: message.requestId,
            duration: 42,
            lines: ["中国农业银行", "6228 4804 0256 4890 018", "12/99", "张三"],
            text: "中国农业银行\n6228 4804 0256 4890 018\n12/99\n张三",
          },
        });
      });
    };

    const fileLike =
      typeof File !== "undefined"
        ? new File(["fake"], "sample.png", { type: "image/png" })
        : new Blob(["fake"], { type: "image/png" });

    const result = await instance.recognize(fileLike, "bankCard");

    assert.equal(result.valid, true);
    assert.equal(result.bankName, "中国农业银行");
    assert.equal(result.cardNumber, "6228480402564890018");
  } finally {
    globalThis.FileReader = originalFileReader;
  }
});

test("recognize maps engine asset failures to ASSET_LOAD_FAILED", async () => {
  const instance = createWebOCR();
  instance.isReady = true;
  instance.iframe = {
    contentWindow: {},
    remove() {},
  };

  instance.postToFrame = (message) => {
    queueMicrotask(() => {
      instance.handleMessage({
        source: instance.iframe.contentWindow,
        data: {
          source: "luciaocr-web-engine",
          type: "OCR_ERROR",
          requestId: message.requestId,
          message: "Failed to load OCR detection model",
        },
      });
    });
  };

  await assert.rejects(
    () => instance.recognize("data:image/png;base64,ZmFrZQ==", "general"),
    (error) => {
      assert.equal(error.code, "ASSET_LOAD_FAILED");
      assert.match(error.message, /Failed to load OCR detection model/);
      return true;
    }
  );
});

test("recognize maps missing engine responses to RECOGNIZE_TIMEOUT", async () => {
  const instance = createWebOCR({
    recognizeTimeout: 5,
  });
  instance.isReady = true;
  instance.iframe = {
    contentWindow: {},
    remove() {},
  };
  instance.postToFrame = () => {};

  await assert.rejects(
    () =>
      instance.recognize("data:image/png;base64,ZmFrZQ==", "general", {
        recognizeTimeout: 5,
      }),
    (error) => {
      assert.equal(error.code, "RECOGNIZE_TIMEOUT");
      return true;
    }
  );
});

test("destroy is safe in a non-browser test environment", () => {
  destroyOCR();
  assert.equal(getVersion(), SDK_WEB_VERSION);
  assert.equal(isInitialized(), false);
});
