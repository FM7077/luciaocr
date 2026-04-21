# `plan.md` 规划草案：`uni-app lf-OCR` 迁移为 React 双端版本

## 摘要
本规划面向一个当前基于 `uni-app + WebView/HTML OCR 引擎 + JS 证件解析模板` 的离线 OCR 项目，目标是迁移为 React 双端方案，覆盖 `React Web` 与 `React Native`，并尽量完整保留现有能力：离线 OCR、通用文字识别、身份证/银行卡/驾驶证结构化解析、图片选择、识别结果展示、复制结果。

除完成双端重构外，本次规划同时以“可发布为 npm SDK”为目标进行工程化设计。也就是说，重构后的产物不只是一组可运行的 Web/RN 页面，还应包含一组对外可安装、可构建、可类型提示、可携带 OCR 资源并可独立发布的 npm 包。

默认采用“两层拆分 + 包级发布”实施：
1. 抽离与宿主无关的核心能力为共享 `core`。
2. 分别实现 `web` 与 `native` 两个宿主层，保证同一套模板解析和结果结构。
3. 以包的形式产出 `core`、`web`、`react-native` 适配层，并保留独立 demo/app 用于验证与示例。

规划按阶段推进，先保证共享能力和 Web 可落地，再接入 React Native 宿主层，以降低风险并尽早验证 OCR 资产可复用性。只有当包结构、构建产物、资源分发和 API 契约都稳定后，才视为具备对外发布 npm SDK 的条件。

## 关键实现方案
### 1. 总体架构
- 建立单仓或工作区结构：
  - `packages/sdk-core`
  - `packages/sdk-web`
  - `packages/sdk-react-native`
  - `packages/ocr-assets` 或由 `sdk-web`/`sdk-react-native` 各自携带资源
  - `apps/demo-web`
  - `apps/demo-native`
- `sdk-core` 负责纯 JS 逻辑：模板解析、校验器、格式化工具、统一 OCR 结果类型、识别服务接口定义。
- `sdk-web` 负责浏览器环境适配、OCR 资源加载、Web 引擎接入与 React 友好的调用接口。
- `sdk-react-native` 负责 RN 环境适配、WebView/桥接层、图片输入适配与 RN 友好的调用接口。
- `apps/demo-web` 和 `apps/demo-native` 仅用于验收、调试和文档示例，不作为 npm 发布物。
- 不再沿用 `uni.*`、`plus.webview` 等平台 API；所有平台能力改为宿主层适配。
- SDK 与 demo 分离，避免“页面代码、平台代码、对外库代码”混杂，确保 npm 包边界清晰。

### 2. npm SDK 包设计
- 默认发布物建议如下：
  - `@scope/ocr-core`：纯逻辑层，对外暴露模板解析器、类型、校验器、格式化工具。
  - `@scope/ocr-web`：浏览器适配层，对外暴露 `initOCR`、`recognize`、`destroyOCR` 等运行时接口。
  - `@scope/ocr-react-native`：React Native 适配层，对外暴露桥接组件、服务封装和类型。
- 若前期复杂度需要控制，可采用“两步发布”：
  - 第一步仅发布 `@scope/ocr-core` 与 `@scope/ocr-web`
  - 第二步在 RN 桥接稳定后发布 `@scope/ocr-react-native`
- 包之间的依赖方向保持单向：
  - `sdk-core` 不依赖宿主层
  - `sdk-web` 依赖 `sdk-core`
  - `sdk-react-native` 依赖 `sdk-core`
- 每个 npm 包至少具备：
  - `name`
  - `version`
  - `license`
  - `repository`
  - `main`
  - `module`
  - `types`
  - `exports`
  - `files`
  - `sideEffects`
  - `peerDependencies` / `dependencies` 的明确边界
- 包命名、作用域和公开级别需在项目开始时确定，避免后续 rename 带来的使用方迁移成本。

### 3. 共享核心能力抽离
- 从现有 `uni_modules/lf-OCR/js_sdk/templates/*.js`、`utils/*.js` 中抽离纯函数逻辑到 `core`。
- 保持现有模板能力与字段语义不变，包括：
  - `general`
  - `idCard`
  - `bankCard`
  - `driverLicense`
- 统一公开接口：
  - `initOCR(options)`
  - `recognize(imageSource, template)`
  - `destroyOCR()`
  - `parseIdCard / parseBankCard / parseDriverLicense / parseGeneral`
- 明确统一返回结构，确保双端字段一致，至少保留：
  - `text`
  - `rawText`
  - `lines`
  - `duration`
  - `valid`
  - 模板专属结构化字段
- 对现有“是否身份证/银行卡/驾驶证”“是否过期”“正反面/主页副页”等判定保留原逻辑。
- `sdk-core` 不直接依赖 DOM、WebView、`window`、`document`、`uni`、RN 原生模块，确保可在 Node 测试环境中执行单元测试。
- `sdk-core` 对外导出稳定类型：
  - `OCRTemplate`
  - `OCRResultBase`
  - `IdCardResult`
  - `BankCardResult`
  - `DriverLicenseResult`
  - `GeneralTextResult`
  - `OCRError`
- 解析器与结果类型的导出路径需固定，避免后续使用方通过深层路径引用内部文件。

### 4. Web SDK 与 React Web 宿主方案
- 使用 React + Vite 作为 Web 端实现基线。
- 复用现有 `hybrid/html` 内的 ONNX、字典、OCR HTML/JS 资源，优先改造为可由 Web React 页面直接调用的引擎模块。
- 若现有 `ocr.html` 不适合作为模块直接复用，则保留隐藏 `iframe` 方案，但消息协议改为标准 `postMessage`，不再依赖 `uni` 或特定容器行为。
- Web 端页面能力需覆盖：
  - 模板切换
  - 本地图片选择
  - OCR 初始化进度展示
  - 识别执行与加载态
  - 结构化结果展示
  - 复制结果
- Web 端需优先完成，用于验证 OCR 模型、字典、前处理和模板解析是否可在 React 体系下稳定运行。
- `sdk-web` 对外提供两层能力：
  - 运行时 SDK：`initOCR`、`recognize`、`destroyOCR`
  - 可选 React 封装：如 `OCRProvider`、`useOCR`，仅在确有必要时提供
- 浏览器资源加载方式需明确：
  - 由包内自带默认资源
  - 或允许调用方通过 `assetBaseUrl` / `resolveAssetUrl()` 覆盖资源地址
- 若使用 `iframe`，需定义包内资源路径与宿主页面路径解耦方案，避免使用方部署在子路径时失效。
- Web 包需支持常见构建工具消费，至少验证 Vite 场景；如后续面向更广泛用户，可补充 Webpack/Next.js 兼容说明。

### 5. React Native SDK 与宿主方案
- 使用 React Native + `react-native-webview` 承载 OCR HTML 引擎。
- 使用宿主库替换平台能力：
  - 图片选择：相机/相册选择库
  - 剪贴板：RN 剪贴板库
  - Toast/Loading：应用内组件或宿主库
- Native 端 OCR 不直接重写为原生推理，默认继续复用 HTML/JS OCR 引擎，通过 WebView 与 RN 通信。
- 设计统一桥接协议：
  - `OCR_READY`
  - `OCR_PROGRESS`
  - `OCR_RESULT`
  - `OCR_ERROR`
  - `RECOGNIZE_REQUEST`
- Native 端需解决本地图片路径在 WebView 中的可访问性；默认采用“转 base64 或临时可访问 URI”的方式，避免依赖 `file://` 在不同平台的不一致行为。
- iOS 与 Android 都按同一桥接协议实施，但路径处理、资源打包方式允许各自单独适配。
- `sdk-react-native` 应优先提供“服务层 + 组件层”两种接入方式：
  - 服务层：统一调用接口和事件协议
  - 组件层：封装好的 WebView 容器与桥接逻辑
- RN 包需明确 `peerDependencies`：
  - `react`
  - `react-native`
  - `react-native-webview`
- RN 资源打包方案需单独设计，避免 npm 包发布后出现“JS 安装成功但 ONNX/WASM/HTML 资源未打入 app”的问题。
- 若 RN 端的资源嵌入方案在首期无法稳定工程化，则可先将 RN 包标记为 beta，避免与 Web 包同等级对外承诺。

### 6. 资源分发与运行时加载方案
- OCR 运行依赖的不只是 JS 代码，还包括：
  - `onnx` 模型文件
  - `wasm` 文件
  - `txt` 字典文件
  - `ocr.html` 与配套脚本
- 这些资源必须被视为 SDK 正式产物的一部分，而不是 demo 中的附属文件。
- 推荐两种实现路线，二选一并尽早冻结：
  - 路线 A：由各宿主包内携带资源，安装后即可使用
  - 路线 B：发布独立 `ocr-assets` 包，由 `sdk-web` / `sdk-react-native` 约定方式引用
- 无论采用哪条路线，都需要明确：
  - npm 打包时资源是否进入 `files`
  - 构建后目录结构
  - 运行时如何解析资源 URL / URI
  - CDN、自托管、包内相对路径三种场景的优先级
- 对外初始化接口建议显式接收资源配置，例如：
  - `assetBaseUrl`
  - `assetResolver`
  - `modelPaths`
  - `wasmPaths`
- 所有资源路径设计必须避免写死当前 `uni_modules/lf-OCR/hybrid/html` 的目录结构。

### 7. SDK API 与类型契约
- 公开 API 需要在计划阶段冻结最小集合，避免宿主实现完成后再反向改接口：
  - `initOCR(options)`
  - `recognize(input, template, options?)`
  - `destroyOCR()`
  - `getVersion()`
  - `isInitialized()`
- 初始化参数至少应覆盖：
  - 模型资源路径
  - 初始化超时
  - 并发/串行识别策略
  - 进度回调
  - 日志级别
- 错误模型需统一：
  - `ASSET_LOAD_FAILED`
  - `ENGINE_INIT_FAILED`
  - `UNSUPPORTED_IMAGE_SOURCE`
  - `RECOGNIZE_TIMEOUT`
  - `BRIDGE_ERROR`
  - `PARSE_ERROR`
- 需要定义 semver 视角下的稳定面：
  - 返回字段新增视为向后兼容
  - 字段重命名、删除、错误码变更视为 breaking change
  - 深层内部路径不承诺稳定

### 8. 构建与发布工程化方案
- 推荐采用 workspace 管理多个包，统一脚本：
  - `build`
  - `clean`
  - `lint`
  - `test`
  - `typecheck`
  - `release:check`
- 每个 SDK 包构建产物至少包含：
  - ESM 入口
  - CJS 入口或明确声明仅 ESM
  - 类型声明 `.d.ts`
  - source map
  - 资源文件
- `package.json` 需要明确 `exports`，避免消费者依赖内部目录。
- 发布前自动校验应至少包含：
  - `npm pack` 成功
  - tarball 中包含必要 JS、类型与 OCR 资源
  - 示例项目安装该 tarball 后可跑通初始化与识别
- 发布流程建议：
  1. 在 workspace 内构建全部包
  2. 执行单元/集成/示例验证
  3. 对每个包执行 `npm pack`
  4. 用本地 tarball 回装到 demo 项目验证
  5. 通过后再执行正式 `npm publish`
- 若采用 scoped package，还需提前确定是否公开包以及 npm org/权限配置。

### 9. UI 与交互迁移
- 保持当前单页产品流程与信息架构，避免迁移阶段引入交互重设计。
- 结果展示优先保持字段和文案语义一致，不做产品层重命名。
- 将当前页面中的模板选择、上传区、识别按钮、结果卡片拆成可复用组件，便于 Web/RN 保持一致体验。
- 共享状态机至少包含：
  - `idle`
  - `initializing`
  - `ready`
  - `recognizing`
  - `success`
  - `error`

## 实施阶段与周用量估算
### 阶段 1：代码梳理、包结构落地与共享核心抽离
- 目标：完成 workspace 结构、包边界、模板解析、校验器、格式化工具、统一结果类型与 OCR 服务接口定义。
- 输出：`sdk-core` 可被 Web 和 Native 同时引用，并具备独立构建与测试能力。
- 预计：`0.5 - 1 周`

### 阶段 2：Web SDK 落地与 React Web Demo 验证
- 目标：实现 Web SDK、资源加载方案、Web 页面、图片输入、OCR 引擎接入、结构化结果展示与复制。
- 输出：一个可独立运行的 `sdk-web` 与一个基于该包运行的 React Web demo。
- 预计：`0.5 - 1 周`

### 阶段 3：React Native SDK 与宿主接入
- 目标：完成 RN 包、WebView OCR 桥接、图片路径处理、复制与基础交互。
- 输出：`sdk-react-native` 可被 demo 引用，Android/iOS 可跑通主流程。
- 预计：`1 - 2 周`

### 阶段 4：对齐、回归、发布校验与稳定性处理
- 目标：统一双端结果、补边界处理、验证证件模板、优化错误提示和初始化流程，并完成 `npm pack` 回装验证。
- 输出：双端行为基本一致，SDK 产物可被外部工程安装验证，可进入正式发布准备。
- 预计：`0.5 - 1 周`

### 总体估算
- 双端完整保留当前能力的现实区间：`2.5 - 5 周用量`
- 更稳妥的对外承诺建议：`约 4 周`
- 风险最高的部分：
  - RN WebView 中本地图片访问与资源加载
  - ONNX/WASM/HTML OCR 资源在双端打包后的路径兼容
  - 双端识别结果一致性
  - 当前 `plus.webview` 方案迁移后的通信稳定性
  - npm tarball 中静态资源是否完整、路径是否可被消费者正确解析

## 测试方案
- 核心单元测试：
  - 身份证正面解析
  - 身份证反面解析
  - 银行卡解析与有效期校验
  - 驾驶证主页/副页识别与字段提取
  - 通用文本中的电话、邮箱、日期提取
- 集成测试：
  - OCR 初始化成功/失败
  - 图片选择后识别成功
  - 识别超时或模型加载失败时错误提示正确
  - 复制结果在 Web/RN 均可用
  - `sdk-web` 安装到独立 demo 后可完成初始化与识别
  - `sdk-react-native` 安装到独立 demo 后桥接协议正常
- 回归样本：
  - 每种模板至少准备 3 组样本：正常、模糊、错误类型图片
  - 验证 `valid`、`isExpired`、`side/page` 等关键字段不回退
- 验收标准：
  - Web 与 Native 都能完成完整识别流程
  - 同一张样本图在双端返回字段结构一致
  - 现有模板能力无删减
  - 不依赖联网即可完成 OCR
  - `npm pack` 后 tarball 可安装
  - tarball 中包含运行所需的 JS、类型声明和 OCR 资源
  - 使用 README 中的最小示例能在独立工程中跑通

## 发布与文档要求
- 每个对外 npm 包至少提供：
  - README
  - 快速开始
  - API 文档
  - 资源配置说明
  - Web/RN 最小示例
  - 常见错误排查
- 发布前需核对 License：
  - 代码 License
  - ONNX/WASM/字典/第三方依赖的再分发许可
- 版本策略建议采用 semver，并在文档中明确：
  - `0.x` 期间允许 API 调整但需记录
  - `1.0.0` 前要求 API、目录与资源策略基本冻结
- 变更记录需覆盖：
  - 新增能力
  - breaking changes
  - 资源路径或初始化参数变更
- npm 发布前需要形成正式 checklist：
  - 包名可用
  - 版本号正确
  - `package.json` 字段完整
  - `files` 配置正确
  - README 引用示例有效
  - 示例工程回装通过

## 重要接口与默认决策
- 默认技术路线：
  - Web：React + Vite
  - Native：React Native + WebView
- 默认不做的事：
  - 不在本次迁移中重写 OCR 算法
  - 不把 HTML OCR 引擎改写成原生移动端推理
  - 不新增新证件类型
- 默认保留的公开能力：
  - OCR 初始化
  - OCR 识别
  - OCR 销毁
  - 四类模板解析器与现有校验/格式化工具
- 默认发布策略：
  - `sdk-core`、`sdk-web` 优先达到可发布状态
  - `sdk-react-native` 在资源与桥接稳定后发布，必要时以 beta 形式先行
- 默认包产物策略：
  - 对外只暴露文档约定的入口，不暴露内部文件路径
  - 所有运行时资源纳入 npm 发布物，不要求使用方手动拷贝仓库文件
- 默认兼容目标：
  - Web 可用
  - RN Android/iOS 可用
  - 小程序不纳入本次迁移范围

## 假设
- “React 版本”按双端方案理解，即同时规划 React Web 与 React Native。
- 现有 OCR 模型与 HTML/JS 引擎允许在 Web 和 RN WebView 中复用，不单独采购或替换 OCR 引擎。
- 当前产品只需要延续现有单页流程，不需要新增后端服务、登录、云端 OCR 或数据存储。
- 计划文档以“可直接实施并具备 npm SDK 发布条件”为目标，优先保证技术路径、包边界、资源策略和阶段拆分决策完整。
