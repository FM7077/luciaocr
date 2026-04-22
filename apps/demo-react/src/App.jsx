import { useEffect, useRef, useState } from "react";
import {
  destroyOCR,
  initOCR,
  isInitialized,
  recognize,
} from "@luciaocr/react";

const templates = [
  { value: "general", label: "通用文本" },
  { value: "idCard-CN", label: "身份证" },
  { value: "bankCard", label: "银行卡" },
  { value: "driverLicense-CN", label: "驾驶证" },
];

function formatStructuredResult(result) {
  return JSON.stringify(result, null, 2);
}

export default function App() {
  const [template, setTemplate] = useState("general");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [statusText, setStatusText] = useState("等待初始化");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    async function setup() {
      setStatus("initializing");
      setStatusText("正在初始化 OCR 引擎...");

      try {
        await initOCR({
          assetBaseUrl: "/ocr-runtime/",
          onProgress(message) {
            if (!disposed) {
              setStatusText(message);
            }
          },
        });

        if (!disposed) {
          setStatus("ready");
          setStatusText("OCR 引擎已就绪");
        }
      } catch (setupError) {
        if (!disposed) {
          setStatus("error");
          setError(setupError.message || "初始化失败");
          setStatusText("初始化失败");
        }
      }
    }

    setup();

    return () => {
      disposed = true;
      destroyOCR();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  function onPickFile(event) {
    const nextFile = event.target.files?.[0];
    if (!nextFile) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResult(null);
    setError("");
  }

  async function onRecognize() {
    if (!file) {
      return;
    }

    setStatus("recognizing");
    setStatusText("正在识别...");
    setError("");
    setResult(null);

    try {
      const nextResult = await recognize(file, template);
      setResult(nextResult);
      setStatus("success");
      setStatusText("识别完成");
    } catch (recognizeError) {
      setStatus("error");
      setStatusText("识别失败");
      setError(recognizeError.message || "识别失败");
    }
  }

  async function onCopy() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(formatStructuredResult(result));
    setStatusText("结果已复制到剪贴板");
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">luciaocr Demo Web</p>
        <h1>离线 OCR Web 验证台</h1>
        <p className="hero-copy">
          用这页直接验证 `@luciaocr/react` 的资源加载、引擎初始化、模板识别和结构化结果。
        </p>
        <div className={`status-pill status-${status}`}>
          {statusText} {isInitialized() ? "· Ready" : ""}
        </div>
      </section>

      <section className="workspace-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>识别配置</h2>
            <button
              className="ghost-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              选择图片
            </button>
          </div>

          <div className="template-row">
            {templates.map((item) => (
              <button
                key={item.value}
                type="button"
                className={
                  item.value === template
                    ? "template-chip template-chip-active"
                    : "template-chip"
                }
                onClick={() => setTemplate(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <input
            ref={fileInputRef}
            className="hidden-input"
            type="file"
            accept="image/*"
            onChange={onPickFile}
          />

          <div className="preview-box">
            {previewUrl ? (
              <img alt="OCR preview" src={previewUrl} className="preview-image" />
            ) : (
              <div className="empty-preview">
                <strong>还没有图片</strong>
                <span>支持本地图片、截图和手机拍照后的文件。</span>
              </div>
            )}
          </div>

          <div className="action-row">
            <button
              type="button"
              className="primary-button"
              disabled={!file || status === "initializing" || status === "recognizing"}
              onClick={onRecognize}
            >
              开始识别
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={!result}
              onClick={onCopy}
            >
              复制结果
            </button>
          </div>

          {error ? <p className="error-text">{error}</p> : null}
        </div>

        <div className="panel result-panel">
          <div className="panel-header">
            <h2>结构化结果</h2>
            <span className="meta-text">
              {result ? `${result.duration || 0} ms` : "等待识别"}
            </span>
          </div>

          <pre className="result-block">
            {result ? formatStructuredResult(result) : "识别结果会显示在这里。"}
          </pre>
        </div>
      </section>
    </main>
  );
}
