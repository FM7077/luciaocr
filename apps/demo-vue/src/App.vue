<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { destroyOCR, initOCR, isInitialized, recognize } from "@luciaocr/vue";

const templates = [
  { value: "general", label: "通用文本" },
  { value: "idCard-CN", label: "身份证" },
  { value: "bankCard", label: "银行卡" },
  { value: "driverLicense-CN", label: "驾驶证" },
];

const template = ref("general");
const file = ref(null);
const previewUrl = ref("");
const status = ref("idle");
const statusText = ref("等待初始化");
const result = ref(null);
const error = ref("");

const resultText = computed(() =>
  result.value ? JSON.stringify(result.value, null, 2) : "识别结果会显示在这里。"
);

async function setupOCR() {
  status.value = "initializing";
  statusText.value = "正在初始化 OCR 引擎...";

  try {
    await initOCR({
      assetBaseUrl: "/ocr-runtime/",
      onProgress(message) {
        statusText.value = message;
      },
    });
    status.value = "ready";
    statusText.value = "OCR 引擎已就绪";
  } catch (setupError) {
    status.value = "error";
    error.value = setupError.message || "初始化失败";
    statusText.value = "初始化失败";
  }
}

setupOCR();

function onPickFile(event) {
  const nextFile = event.target.files?.[0];
  if (!nextFile) {
    return;
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  file.value = nextFile;
  previewUrl.value = URL.createObjectURL(nextFile);
  result.value = null;
  error.value = "";
}

async function onRecognize() {
  if (!file.value) {
    return;
  }

  status.value = "recognizing";
  statusText.value = "正在识别...";
  error.value = "";
  result.value = null;

  try {
    const nextResult = await recognize(file.value, template.value);
    result.value = nextResult;
    status.value = "success";
    statusText.value = "识别完成";
  } catch (recognizeError) {
    status.value = "error";
    statusText.value = "识别失败";
    error.value = recognizeError.message || "识别失败";
  }
}

async function onCopy() {
  if (!result.value) {
    return;
  }

  await navigator.clipboard.writeText(JSON.stringify(result.value, null, 2));
  statusText.value = "结果已复制到剪贴板";
}

onBeforeUnmount(() => {
  destroyOCR();
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">luciaocr Demo Vue</p>
      <h1>离线 OCR Vue 验证台</h1>
      <p class="hero-copy">
        用这页直接验证 <code>@luciaocr/vue</code> 的资源加载、引擎初始化、模板识别和结构化结果。
      </p>
      <div :class="`status-pill status-${status}`">
        {{ statusText }} {{ isInitialized() ? "· Ready" : "" }}
      </div>
    </section>

    <section class="workspace-grid">
      <div class="panel">
        <div class="panel-header">
          <h2>识别配置</h2>
          <label class="ghost-button">
            选择图片
            <input class="hidden-input" type="file" accept="image/*" @change="onPickFile" />
          </label>
        </div>

        <div class="template-row">
          <button
            v-for="item in templates"
            :key="item.value"
            type="button"
            :class="
              item.value === template
                ? 'template-chip template-chip-active'
                : 'template-chip'
            "
            @click="template = item.value"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="preview-box">
          <img v-if="previewUrl" alt="OCR preview" :src="previewUrl" class="preview-image" />
          <div v-else class="empty-preview">
            <strong>还没有图片</strong>
            <span>支持本地图片、截图和手机拍照后的文件。</span>
          </div>
        </div>

        <div class="action-row">
          <button
            type="button"
            class="primary-button"
            :disabled="!file || status === 'initializing' || status === 'recognizing'"
            @click="onRecognize"
          >
            开始识别
          </button>
          <button type="button" class="secondary-button" :disabled="!result" @click="onCopy">
            复制结果
          </button>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>
      </div>

      <div class="panel result-panel">
        <div class="panel-header">
          <h2>结构化结果</h2>
          <span class="meta-text">{{ result ? `${result.duration || 0} ms` : "等待识别" }}</span>
        </div>

        <pre class="result-block">{{ resultText }}</pre>
      </div>
    </section>
  </main>
</template>
