import { CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { injectLuciaocr } from "@luciaocr/angular";
import type { OCRResult, OCRTemplate } from "@luciaocr/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="page-shell">
      <section class="hero-card">
        <p class="eyebrow">luciaocr Demo Angular</p>
        <h1>离线 OCR Angular 验证台</h1>
        <p class="hero-copy">
          用这页直接验证 <code>@luciaocr/angular</code> 的资源加载、引擎初始化、模板识别和结构化结果。
        </p>
        <div class="status-pill" [class]="'status-pill status-' + status">
          {{ statusText }} {{ ocr.isInitialized() ? "· Ready" : "" }}
        </div>
      </section>

      <section class="workspace-grid">
        <div class="panel">
          <div class="panel-header">
            <h2>识别配置</h2>
            <label class="ghost-button">
              选择图片
              <input class="hidden-input" type="file" accept="image/*" (change)="onPickFile($event)" />
            </label>
          </div>

          <div class="template-row">
            <button
              *ngFor="let item of templates"
              type="button"
              [class]="item.value === template ? 'template-chip template-chip-active' : 'template-chip'"
              (click)="template = item.value"
            >
              {{ item.label }}
            </button>
          </div>

          <div class="preview-box">
            <img *ngIf="previewUrl; else emptyPreview" alt="OCR preview" [src]="previewUrl" class="preview-image" />
            <ng-template #emptyPreview>
              <div class="empty-preview">
                <strong>还没有图片</strong>
                <span>支持本地图片、截图和手机拍照后的文件。</span>
              </div>
            </ng-template>
          </div>

          <div class="action-row">
            <button
              type="button"
              class="primary-button"
              [disabled]="!file || status === 'initializing' || status === 'recognizing'"
              (click)="onRecognize()"
            >
              开始识别
            </button>
            <button type="button" class="secondary-button" [disabled]="!result" (click)="onCopy()">
              复制结果
            </button>
          </div>

          <p *ngIf="error" class="error-text">{{ error }}</p>
        </div>

        <div class="panel result-panel">
          <div class="panel-header">
            <h2>结构化结果</h2>
            <span class="meta-text">{{ result ? (result.duration || 0) + " ms" : "等待识别" }}</span>
          </div>

          <pre class="result-block">{{ result ? formatStructuredResult(result) : "识别结果会显示在这里。" }}</pre>
        </div>
      </section>
    </main>
  `,
})
export class AppComponent implements OnDestroy {
  readonly ocr = injectLuciaocr();
  readonly templates = [
    { value: "general", label: "通用文本" },
    { value: "idCard-CN", label: "身份证" },
    { value: "bankCard", label: "银行卡" },
    { value: "driverLicense-CN", label: "驾驶证" },
  ];

  template: OCRTemplate = "general";
  file: File | null = null;
  previewUrl = "";
  status = "idle";
  statusText = "等待初始化";
  result: OCRResult | null = null;
  error = "";

  constructor() {
    void this.setupOCR();
  }

  async setupOCR() {
    this.status = "initializing";
    this.statusText = "正在初始化 OCR 引擎...";

    try {
      await this.ocr.init({
        assetBaseUrl: "/ocr-runtime/",
        onProgress: (message) => {
          this.statusText = message;
        },
      });
      this.status = "ready";
      this.statusText = "OCR 引擎已就绪";
    } catch (setupError) {
      this.status = "error";
      this.error = setupError instanceof Error ? setupError.message : "初始化失败";
      this.statusText = "初始化失败";
    }
  }

  onPickFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const nextFile = target.files?.[0];
    if (!nextFile) {
      return;
    }

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.file = nextFile;
    this.previewUrl = URL.createObjectURL(nextFile);
    this.result = null;
    this.error = "";
  }

  async onRecognize() {
    if (!this.file) {
      return;
    }

    this.status = "recognizing";
    this.statusText = "正在识别...";
    this.error = "";
    this.result = null;

    try {
      this.result = await this.ocr.recognize(this.file, this.template);
      this.status = "success";
      this.statusText = "识别完成";
    } catch (recognizeError) {
      this.status = "error";
      this.statusText = "识别失败";
      this.error =
        recognizeError instanceof Error ? recognizeError.message : "识别失败";
    }
  }

  async onCopy() {
    if (!this.result) {
      return;
    }

    await navigator.clipboard.writeText(JSON.stringify(this.result, null, 2));
    this.statusText = "结果已复制到剪贴板";
  }

  formatStructuredResult(result: unknown) {
    return JSON.stringify(result, null, 2);
  }

  ngOnDestroy() {
    this.ocr.destroy();
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}
