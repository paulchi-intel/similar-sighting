const MESSAGE_TYPES = {
  GET_ACTIVE_HSD_PAGE: "GET_ACTIVE_HSD_PAGE",
  OPEN_HSD_ARTICLE_PAGE: "OPEN_HSD_ARTICLE_PAGE",
  GET_SETTINGS: "GET_SETTINGS",
  SEARCH_SIMILAR_SIGHTING: "SEARCH_SIMILAR_SIGHTING",
  SUMMARIZE_TOP5_RESULTS: "SUMMARIZE_TOP5_RESULTS",
  SUMMARIZE_ITEM_PROGRESS: "SUMMARIZE_ITEM_PROGRESS",
  GET_MODELS: "GET_MODELS",
  GET_MODEL_CONFIG: "GET_MODEL_CONFIG",
  SAVE_MODEL_CONFIG: "SAVE_MODEL_CONFIG"
};

const HSD_ARTICLE_URL = "https://hsdes.intel.com/appstore/article-one/#/article";

const DEFAULTS = {
  keywordCount: 3,
  selectedModel: "claude-haiku-4-5"
};

const COMPARE_BATCH_SIZE = 5;

const STORAGE_KEYS = {
  language: "language",
  panelState: "panelState"
};

const TRANSLATIONS = {
  "zh-TW": {
    clear: "清除",
    "load-hsd": "載入 HSD",
    "load-clipboard": "載入剪貼簿",
    settings: "設定",
    "status-ready": "準備就緒，請在 HSD 頁面按「載入 HSD」，或是在剪貼簿中複製好查詢內容，並按下「載入剪貼簿」。",
    "status-config-required": "請先點擊 🔑 Similar Sighting 設定 API key 與 model",
    "status-loading-page": "正在載入 HSD 頁面與產生keywords...",
    "status-loading-clipboard": "正在載入剪貼簿內容與產生keywords...",
    "status-model-extract": "已用 model({model}) 抽取 keyword，請確認後按搜尋。",
    "status-searching": "正在觸發 Similar Sighting 搜尋...",
    "status-search-sent": "搜尋已送出: {query}",
    "status-cleared": "已清除目前頁面與關鍵字。",
    "status-models-loading": "正在載入 models...",
    "status-models-loaded": "models 已載入，共 {count} 個",
    "status-model-saved": "已儲存 API key 與 model: {model}",
    "status-load-settings-failed": "載入設定失敗: {error}",
    "status-load-model-config-failed": "載入 model 設定失敗: {error}",
    "status-load-models-failed": "載入 models 失敗: {error}",
    "status-save-model-failed": "儲存 model 設定失敗: {error}",
    "status-load-page-failed": "載入失敗: {error}",
    "status-load-clipboard-failed": "載入剪貼簿失敗: {error}",
    "status-search-failed": "搜尋失敗: {error}",
    "error-api-format": "API key 格式無效，需以 pak_ 開頭",
    "error-api-prefix": "API key 必須以 pak_ 開頭",
    "error-no-keyword": "請至少輸入 1 個 keyword",
    "error-clipboard-empty": "剪貼簿是空的",
    "hsd-page": "HSD Page",
    "page-not-loaded": "尚未載入頁面資訊",
    "page-title": "標題",
    "page-url": "網址",
    "extract-source": "抽詞來源",
    "extract-model": "model",
    "configured-count": "本次設定抽取數量",
    "extracted-count": "實際抽取數量",
    "keywords-title": "Chat Container - Keywords",
    "add-keyword": "+ 新增 keyword",
    "keywords-hint": "你可以直接修改、增減 keyword，再按下搜尋。",
    "search-similar": "搜尋 Similar Sighting",
    "summarize-top5": "比較5筆資料",
    "summarize-next5": "比較下5筆資料",
    "summary-title": "Sighting 比较結果",
    "status-summarizing": "正在開啟第{start}到{end}筆結果並產生比较...",
    "status-summarizing-progress": "正在比較中... ({done}/{total} 完成)",
    "skeleton-comparing": "比較中...",
    "status-summary-done": "已完成比較，可再次按下比較下5筆",
    "status-summary-all-done": "已完成目前可比較的資料",
    "status-summary-failed": "摘要失敗: {error}",
    "summary-item": "Sighting {index}",
    "keyword-placeholder": "keyword {index}",
    "clipboard-title": "剪貼簿內容",
    "brief-summary": "問題簡述",
    "generate-report": "整理報告",
    "filter-similarity": "相似度 ≥",
    "filter-platform": "Platform 含",
    "filter-no-limit": "不限",
    "filter-year": "年份 ≥",
    "apply-filter": "套用過濾",
    "reset-filter": "重設",
    "copy-report": "複製報告",
    "copy-report-done": "✓ 已複製",
    "report-stats": "過濾後保留 {kept} / 共 {total} 筆",
    "report-empty": "無符合條件的結果",
    "modal-api-key-title": "設定 API Key",
    "modal-api-key-hint": "請輸入 API Key（以 pak_ 開頭）",
    "modal-cancel": "取消",
    "modal-confirm": "確認"
  },
  "zh-CN": {
    clear: "清除",
    "load-hsd": "载入 HSD",
    "load-clipboard": "载入剪贴板",
    settings: "设置",
    "status-ready": "准备就绪，请在 HSD 页面点击'载入 HSD'，或是在剪贴板中复制好查询内容，并按下'载入剪贴板'。",
    "status-config-required": "请先点击 🔑 Similar Sighting 设置 API key 与 model",
    "status-loading-page": "正在载入 HSD 页面与产生keywords...",
    "status-loading-clipboard": "正在载入剪贴板内容与产生keywords...",
    "status-model-extract": "已用 model({model}) 抽取 keyword，请确认后再搜索。",
    "status-searching": "正在触发 Similar Sighting 搜索...",
    "status-search-sent": "搜索已送出: {query}",
    "status-cleared": "已清除当前页面与关键词。",
    "status-models-loading": "正在载入 models...",
    "status-models-loaded": "models 已载入，共 {count} 个",
    "status-model-saved": "已保存 API key 与 model: {model}",
    "status-load-settings-failed": "载入设置失败: {error}",
    "status-load-model-config-failed": "载入 model 设置失败: {error}",
    "status-load-models-failed": "载入 models 失败: {error}",
    "status-save-model-failed": "保存 model 设置失败: {error}",
    "status-load-page-failed": "载入失败: {error}",
    "status-load-clipboard-failed": "载入剪贴板失败: {error}",
    "status-search-failed": "搜索失败: {error}",
    "error-api-format": "API key 格式无效，需以 pak_ 开头",
    "error-api-prefix": "API key 必须以 pak_ 开头",
    "error-no-keyword": "请至少输入 1 个 keyword",
    "error-clipboard-empty": "剪贴板是空的",
    "hsd-page": "HSD Page",
    "page-not-loaded": "尚未载入页面信息",
    "page-title": "标题",
    "page-url": "网址",
    "extract-source": "抽词来源",
    "extract-model": "model",
    "configured-count": "本次設定抽取数量",
    "extracted-count": "实际抽取数量",
    "keywords-title": "Chat Container - Keywords",
    "add-keyword": "+ 新增 keyword",
    "keywords-hint": "你可以直接修改、增减 keyword，再按下搜索。",
    "search-similar": "搜索 Similar Sighting",
    "summarize-top5": "总结前5个结果",
    "summarize-next5": "总结下5个结果",
    "summary-title": "前5笔 Sighting 简洁摘要",
    "status-summarizing": "正在打开第{start}到第{end}个结果并生成简洁摘要...",
    "status-summarizing-progress": "正在比较中... ({done}/{total} 完成)",
    "skeleton-comparing": "比较中...",
    "status-summary-done": "已完成比较，可再次按下总结下5个结果",
    "status-summary-all-done": "已完成目前可比较的结果",
    "status-summary-failed": "摘要失败: {error}",
    "summary-item": "Sighting {index}",
    "keyword-placeholder": "keyword {index}",
    "clipboard-title": "剪贴板内容",
    "brief-summary": "问题简述",
    "generate-report": "整理报告",
    "filter-similarity": "相似度 ≥",
    "filter-platform": "Platform 含",
    "filter-no-limit": "不限",
    "filter-year": "年份 ≥",
    "batch-divider": "―― 第{start}-{end}笔 ――",
    "apply-filter": "套用过滤",
    "reset-filter": "重设",
    "copy-report": "复制报告",
    "copy-report-done": "✓ 已复制",
    "report-stats": "过滤后保留 {kept} / 共 {total} 笔",
    "report-empty": "无符合条件的结果",
    "modal-api-key-title": "设置 API Key",
    "modal-api-key-hint": "请输入 API Key（以 pak_ 开头）",
    "modal-cancel": "取消",
    "modal-confirm": "确认"
  },
  en: {
    clear: "Clear",
    "load-hsd": "Load HSD",
    "load-clipboard": "Load Clipboard",
    settings: "Settings",
    "status-ready": "Ready. Open an HSD page and click \"Load HSD\", or copy your query to clipboard and click \"Load Clipboard\".",
    "status-config-required": "Click 🔑 Similar Sighting first to set API key and model",
    "status-loading-page": "Loading HSD page and generating keywords...",
    "status-loading-clipboard": "Loading clipboard content and generating keywords...",
    "status-model-extract": "Keywords extracted by model({model}). Review and search.",
    "status-searching": "Triggering Similar Sighting search...",
    "status-search-sent": "Search sent: {query}",
    "status-cleared": "Current page info and keywords were cleared.",
    "status-models-loading": "Loading models...",
    "status-models-loaded": "Loaded {count} models",
    "status-model-saved": "Saved API key and model: {model}",
    "status-load-settings-failed": "Failed to load settings: {error}",
    "status-load-model-config-failed": "Failed to load model config: {error}",
    "status-load-models-failed": "Failed to load models: {error}",
    "status-save-model-failed": "Failed to save model config: {error}",
    "status-load-page-failed": "Load failed: {error}",
    "status-load-clipboard-failed": "Failed to load clipboard: {error}",
    "status-search-failed": "Search failed: {error}",
    "error-api-format": "API key format is invalid. It must start with pak_",
    "error-api-prefix": "API key must start with pak_",
    "error-no-keyword": "Please enter at least one keyword",
    "error-clipboard-empty": "Clipboard is empty",
    "hsd-page": "HSD Page",
    "page-not-loaded": "Page information is not loaded yet",
    "page-title": "Title",
    "page-url": "URL",
    "extract-source": "Extraction source",
    "extract-model": "model",
    "configured-count": "Configured keyword count",
    "extracted-count": "Extracted keyword count",
    "keywords-title": "Chat Container - Keywords",
    "add-keyword": "+ Add keyword",
    "keywords-hint": "You can edit, add, or remove keywords before searching.",
    "search-similar": "Search Similar Sighting",
    "summarize-top5": "Summarize Top 5 Results",
    "summarize-next5": "Summarize Next 5 Results",
    "summary-title": "Top 5 Sighting Concise Summaries",
    "status-summarizing": "Opening results {start} to {end} and generating concise summaries...",
    "status-summarizing-progress": "Comparing... ({done}/{total} done)",
    "skeleton-comparing": "Comparing...",
    "status-summary-done": "Summaries completed. Click to summarize the next 5 results",
    "status-summary-all-done": "All available results have been summarized",
    "status-summary-failed": "Summarization failed: {error}",
    "summary-item": "Sighting {index}",
    "keyword-placeholder": "keyword {index}",
    "clipboard-title": "Clipboard Content",
    "brief-summary": "Issue Summary",
    "generate-report": "Report",
    "filter-similarity": "Similarity ≥",
    "filter-platform": "Platform contains",
    "filter-no-limit": "Any",
    "filter-year": "Year ≥",
    "batch-divider": "―― Items {start}-{end} ――",
    "apply-filter": "Apply Filter",
    "reset-filter": "Reset",
    "copy-report": "Copy Report",
    "copy-report-done": "✓ Copied",
    "report-stats": "Showing {kept} / {total} sightings",
    "report-empty": "No matching results",
    "modal-api-key-title": "Set API Key",
    "modal-api-key-hint": "Enter your API Key (starts with pak_)",
    "modal-cancel": "Cancel",
    "modal-confirm": "Confirm"
  }
};

const UI = {
  titleBtn: document.getElementById("titleBtn"),
  clearBtn: document.getElementById("clearBtn"),
  languageSelect: document.getElementById("languageSelect"),
  statusIndicator: document.getElementById("statusIndicator"),
  statusText: document.getElementById("statusText"),
  pageInfo: document.getElementById("pageInfo"),
  pageTitle: document.getElementById("pageTitle"),
  keywordList: document.getElementById("keywordList"),
  reloadBtn: document.getElementById("reloadBtn"),
  loadClipboardBtn: document.getElementById("loadClipboardBtn"),
  loadButtonsContainer: document.getElementById("loadButtonsContainer"),
  contentSection: document.getElementById("contentSection"),
  addKeywordBtn: document.getElementById("addKeywordBtn"),
  searchBtn: document.getElementById("searchBtn"),
  summarizeTop5Btn: document.getElementById("summarizeTop5Btn"),
  summaryCard: document.getElementById("summaryCard"),
  summaryList: document.getElementById("summaryList"),
  generateReportBtn: document.getElementById("generateReportBtn"),
  reportFilterRow: document.getElementById("reportFilterRow"),
  filterSimilarity: document.getElementById("filterSimilarity"),
  filterPlatform: document.getElementById("filterPlatform"),
  filterYear: document.getElementById("filterYear"),
  applyReportBtn: document.getElementById("applyReportBtn"),
  resetReportBtn: document.getElementById("resetReportBtn"),
  reportArea: document.getElementById("reportArea"),
  reportStats: document.getElementById("reportStats"),
  reportList: document.getElementById("reportList"),
  copyReportBtn: document.getElementById("copyReportBtn"),
  modelModal: document.getElementById("modelModal"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  modelSelect: document.getElementById("modelSelect"),
  closeModelBtn: document.getElementById("closeModelBtn"),
  cancelModelBtn: document.getElementById("cancelModelBtn"),
  saveModelBtn: document.getElementById("saveModelBtn")
};

const state = {
  settings: { keywordCount: DEFAULTS.keywordCount, defaultKeywords: [] },
  modelConfig: { selectedApiKey: "", selectedModel: DEFAULTS.selectedModel },
  models: [],
  modelQuotas: {},
  currentLanguage: "zh-TW",
  page: null,
  keywords: [],
  compareBatchIndex: 0,
  comparedItems: [],     // 每筆 { index, title, url, fields, rawSummary }
  summarizeProgress: { done: 0, total: 0, offset: -1 }
};

function t(key, params = {}) {
  let text = TRANSLATIONS[state.currentLanguage]?.[key] || TRANSLATIONS["zh-TW"][key] || key;
  Object.keys(params).forEach((paramKey) => {
    text = text.replace(`{${paramKey}}`, String(params[paramKey]));
  });
  return text;
}

function applyLanguage() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.placeholder = t(key);
  });

  UI.languageSelect.value = state.currentLanguage;
  renderKeywordList();
  renderPageMeta();
}

async function loadLanguage() {
  const stored = await chrome.storage.local.get([STORAGE_KEYS.language]);
  const language = stored[STORAGE_KEYS.language];
  if (language === "zh-TW" || language === "zh-CN" || language === "en") {
    state.currentLanguage = language;
  }
}

async function saveLanguage(language) {
  await chrome.storage.local.set({ [STORAGE_KEYS.language]: language });
}

function setStatus(text, isError = false) {
  UI.statusText.textContent = text;
  const isLoading = !isError && (
    text.includes("正在") ||
    text.toLowerCase().includes("loading")
  );
  UI.statusIndicator.className =
    "status-indicator" + (isError ? " error" : isLoading ? " loading" : "");
}

function sendRuntimeMessage(payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false, error: chrome.runtime.lastError.message || "runtime error" });
        return;
      }
      resolve(response || { ok: false, error: "no response" });
    });
  });
}

function normalizeKeyword(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

const KNOWN_INTEL_PLATFORMS = [
  "WCL", "PTL", "ARL", "MTL", "LNL", "RPL", "ADL", "TGL", "ICL", "SPR", "EMR", "GNR", "SRF", "CLR"
];

const KNOWN_INTEL_PRODUCTS = ["IGS", "IPU", "VPU", "DG2", "PVC", "GAUDI"];

function extractIntelPlatform(text) {
  const source = String(text || "").toUpperCase();

  for (const platform of KNOWN_INTEL_PLATFORMS) {
    if (new RegExp(`\\b${platform}\\b`, "i").test(source)) {
      return platform;
    }
  }

  for (const product of KNOWN_INTEL_PRODUCTS) {
    if (new RegExp(`\\b${product}\\b`, "i").test(source)) {
      return product;
    }
  }

  return "";
}

function sanitizePlatformValue(value, ...fallbackTexts) {
  const direct = extractIntelPlatform(value);
  if (direct) return direct;

  for (const text of fallbackTexts) {
    const found = extractIntelPlatform(text);
    if (found) return found;
  }

  return "";
}

function renderPageMeta() {
  if (!state.page) {
    UI.pageInfo.classList.remove("show");
    return;
  }
  const sourceText = state.page.extractionSource || "";
  if (sourceText === "clipboard" || sourceText === "clipboard-model") {
    const chars = state.page.clipboardCharCount || 0;
    UI.pageTitle.textContent = `📋 ${t("load-clipboard")} ${chars} chars`;
  } else {
    UI.pageTitle.textContent = state.page.title || "(N/A)";
  }
  UI.pageInfo.classList.add("show");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildKeywordRow(value, index) {
  const row = document.createElement("div");
  row.className = "keyword-row";

  const input = document.createElement("input");
  input.className = "keyword-input";
  input.type = "text";
  input.value = value;
  input.placeholder = t("keyword-placeholder", { index: index + 1 });
  input.addEventListener("input", () => {
    state.keywords[index] = normalizeKeyword(input.value);
  });

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "-";
  removeBtn.title = "刪除";
  removeBtn.addEventListener("click", () => {
    state.keywords.splice(index, 1);
    renderKeywordList();
  });

  row.appendChild(input);
  row.appendChild(removeBtn);
  return row;
}

function renderKeywordList() {
  UI.keywordList.innerHTML = "";

  if (!state.keywords.length) {
    const fallbackCount = Number(state.settings.keywordCount) || DEFAULTS.keywordCount;
    state.keywords = Array.from({ length: fallbackCount }, () => "");
  }

  state.keywords.forEach((keyword, index) => {
    UI.keywordList.appendChild(buildKeywordRow(keyword, index));
  });
}

async function loadSettings() {
  const response = await sendRuntimeMessage({ type: MESSAGE_TYPES.GET_SETTINGS });
  if (!response.ok) {
    setStatus(t("status-load-settings-failed", { error: response.error }), true);
    return;
  }

  state.settings = response.settings || state.settings;
}

function renderModelOptions() {
  UI.modelSelect.innerHTML = "";
  const modelList = state.models.length ? state.models : [state.modelConfig.selectedModel || DEFAULTS.selectedModel];
  const unique = [...new Set(modelList.filter(Boolean))];

  unique.forEach((model) => {
    const quota = state.modelQuotas[model] || { used: 0, limit: 0 };
    const option = document.createElement("option");
    option.value = model;
    option.textContent = `${model} (${quota.used}/${quota.limit})`;
    UI.modelSelect.appendChild(option);
  });

  UI.modelSelect.value = state.modelConfig.selectedModel || unique[0] || DEFAULTS.selectedModel;
}

function syncModelQuotasFromQuota(modelCostCap) {
  const mapped = {};
  Object.keys(modelCostCap || {}).forEach((model) => {
    const info = modelCostCap[model] || {};
    const limit = Number(info.cap ?? info.limit ?? 0);
    const used = Number(info.cost ?? info.used ?? 0);
    mapped[model] = { used, limit, remaining: Math.max(limit - used, 0) };
  });
  state.modelQuotas = mapped;
  renderModelOptions();
}

function incrementModelUsage(model, count = 1) {
  if (!model) return;
  const current = state.modelQuotas[model] || { used: 0, limit: 0, remaining: 0 };
  const nextUsed = Number(current.used || 0) + count;
  const nextLimit = Number(current.limit || 0);
  state.modelQuotas[model] = { ...current, used: nextUsed, remaining: Math.max(nextLimit - nextUsed, 0) };
  renderModelOptions();
}


function openModelModal() {
  UI.apiKeyInput.value = state.modelConfig.selectedApiKey || "";
  UI.modelModal.classList.add("show");
  UI.apiKeyInput.focus();
  UI.apiKeyInput.select();
}

function closeModelModal() {
  UI.modelModal.classList.remove("show");
}

function isValidApiKey(apiKey) {
  return typeof apiKey === "string" && apiKey.startsWith("pak_") && apiKey.length > 8;
}

async function loadModelConfig() {
  const response = await sendRuntimeMessage({ type: MESSAGE_TYPES.GET_MODEL_CONFIG });
  if (!response.ok) {
    setStatus(t("status-load-model-config-failed", { error: response.error }), true);
    return;
  }

  state.modelConfig = response.config || state.modelConfig;
}


async function refreshModels() {
  const apiKey = (UI.apiKeyInput.value || state.modelConfig.selectedApiKey || "").trim();
  if (!isValidApiKey(apiKey)) {
    setStatus(t("error-api-format"), true);
    return;
  }

  setStatus(t("status-models-loading"));
  const response = await sendRuntimeMessage({
    type: MESSAGE_TYPES.GET_MODELS,
    apiKey
  });

  if (!response.ok) {
    setStatus(t("status-load-models-failed", { error: response.error }), true);
    return;
  }

  state.models = Array.isArray(response.models) ? response.models : [];
  syncModelQuotasFromQuota(response.modelCostCap || {});
  if (state.models.length && !state.models.includes(UI.modelSelect.value)) {
    // Prioritize default model if available in the list
    const defaultModel = DEFAULTS.selectedModel;
    state.modelConfig.selectedModel = state.models.includes(defaultModel) ? defaultModel : state.models[0];
  }
  renderModelOptions();
  setStatus(t("status-models-loaded", { count: state.models.length }));
}

async function saveModelConfig() {
  const selectedApiKey = (UI.apiKeyInput.value || "").trim();
  const selectedModel = (UI.modelSelect.value || "").trim() || DEFAULTS.selectedModel;

  if (selectedApiKey && !isValidApiKey(selectedApiKey)) {
    setStatus(t("error-api-prefix"), true);
    return;
  }

  const response = await sendRuntimeMessage({
    type: MESSAGE_TYPES.SAVE_MODEL_CONFIG,
    config: { selectedApiKey, selectedModel }
  });

  if (!response.ok) {
    setStatus(t("status-save-model-failed", { error: response.error }), true);
    return;
  }

  state.modelConfig = response.config || state.modelConfig;
  closeModelModal();
  setStatus(t("status-model-saved", { model: state.modelConfig.selectedModel }));
  if (isValidApiKey(state.modelConfig.selectedApiKey)) {
    await refreshModels();
  }
}

function mergeKeywords(extracted, defaults, count) {
  const merged = [];

  for (const kw of extracted || []) {
    const normalized = normalizeKeyword(kw);
    if (normalized && !merged.includes(normalized)) merged.push(normalized);
  }

  for (const kw of defaults || []) {
    const normalized = normalizeKeyword(kw);
    if (normalized && !merged.includes(normalized)) merged.push(normalized);
  }

  const finalCount = Math.max(1, Number(count) || DEFAULTS.keywordCount);
  while (merged.length < finalCount) merged.push("");
  return merged.slice(0, finalCount);
}

async function loadActiveHsdPage() {
  clearPanel();
  await loadSettings();

  if (!isValidApiKey(state.modelConfig.selectedApiKey) || !state.modelConfig.selectedModel) {
    setStatus(t("status-config-required"), true);
    openModelModal();
    return;
  }

  setStatus(t("status-loading-page"));
  const response = await sendRuntimeMessage({ type: MESSAGE_TYPES.GET_ACTIVE_HSD_PAGE });

  if (!response.ok) {
    setStatus(t("status-load-page-failed", { error: response.error }), true);
    state.page = null;
    renderPageMeta();
    return;
  }

  const payload = response.payload || {};
  state.settings = payload.settings || state.settings;
  state.page = {
    url: payload.url || "",
    title: payload.title || "",
    selectedModel: payload.selectedModel || state.modelConfig.selectedModel,
    extractionSource: payload.extractionSource || "local"
  };

  state.keywords = mergeKeywords(
    payload.extractedKeywords || [],
    payload.settings?.defaultKeywords || state.settings.defaultKeywords,
    payload.settings?.keywordCount || state.settings.keywordCount
  );

  UI.contentSection.style.display = "flex";
  renderPageMeta();
  renderKeywordList();
  setStatus(
    t("status-model-extract", { model: state.page.selectedModel }),
    false
  );
  incrementModelUsage(state.page.selectedModel);
  await savePanelState();
}

async function loadClipboardContent() {
  clearPanel();
  setStatus(t("status-loading-clipboard"));
  
  try {
    const clipboardText = await navigator.clipboard.readText();
    if (!clipboardText || !clipboardText.trim()) {
      setStatus(t("error-clipboard-empty"), true);
      return;
    }

    await loadSettings();

    if (!isValidApiKey(state.modelConfig.selectedApiKey) || !state.modelConfig.selectedModel) {
      setStatus(t("status-config-required"), true);
      openModelModal();
      return;
    }

    state.page = {
      title: t("clipboard-title"),
      url: "clipboard://",
      selectedModel: state.modelConfig.selectedModel,
      extractionSource: "clipboard"
    };

    // Extract keywords from clipboard using model
    const response = await sendRuntimeMessage({
      type: MESSAGE_TYPES.GET_ACTIVE_HSD_PAGE,
      clipboardText: clipboardText.trim(),
      language: state.currentLanguage
    });

    if (!response.ok) {
      state.page = null;
      state.keywords = [];
      renderPageMeta();
      renderKeywordList();
      setStatus(t("status-load-clipboard-failed", { error: response.error }), true);
      return;
    } else {
      const payload = response.payload || {};
      state.settings = payload.settings || state.settings;
      state.page = {
        url: payload.url || "clipboard://",
        title: payload.title || t("clipboard-title"),
        selectedModel: payload.selectedModel || state.modelConfig.selectedModel,
        extractionSource: payload.extractionSource || "clipboard",
        conciseSummary: payload.conciseSummary || "",
        clipboardCharCount: clipboardText.trim().length
      };

      state.keywords = mergeKeywords(
        payload.extractedKeywords || [],
        payload.settings?.defaultKeywords || state.settings.defaultKeywords,
        payload.settings?.keywordCount || state.settings.keywordCount
      );

      setStatus(
        t("status-model-extract", { model: state.page.selectedModel }),
        false
      );
      incrementModelUsage(state.page.selectedModel);
    }

    await sendRuntimeMessage({
      type: MESSAGE_TYPES.OPEN_HSD_ARTICLE_PAGE,
      url: HSD_ARTICLE_URL
    });

    UI.contentSection.style.display = "flex";
    renderPageMeta();
    renderKeywordList();
    await savePanelState();
  } catch (err) {
    state.page = null;
    setStatus(t("status-load-clipboard-failed", { error: err.message }), true);
  }
}

async function searchSimilarSighting() {
  const cleaned = state.keywords.map(normalizeKeyword).filter(Boolean);
  if (!cleaned.length) {
    setStatus(t("error-no-keyword"), true);
    return;
  }

  UI.searchBtn.disabled = true;
  setStatus(t("status-searching"));

  const response = await sendRuntimeMessage({
    type: MESSAGE_TYPES.SEARCH_SIMILAR_SIGHTING,
    keywords: cleaned
  });

  UI.searchBtn.disabled = false;

  if (!response.ok) {
    setStatus(t("status-search-failed", { error: response.error }), true);
    UI.summarizeTop5Btn.style.display = "none";
    return;
  }

  setStatus(t("status-search-sent", { query: cleaned.join(" ") }));
  state.compareBatchIndex = 0;
  UI.summarizeTop5Btn.style.display = "block";
  UI.summarizeTop5Btn.textContent = t("summarize-top5");
  UI.summarizeTop5Btn.disabled = false;
  UI.summarizeTop5Btn.style.opacity = "1";
  await savePanelState();
}

function clearPanel() {
  state.page = null;
  state.keywords = [];
  state.compareBatchIndex = 0;
  state.comparedItems = [];
  state.summarizeProgress = { done: 0, total: 0, offset: -1 };
  UI.contentSection.style.display = "none";
  UI.summarizeTop5Btn.style.display = "none";
  UI.summarizeTop5Btn.textContent = t("summarize-top5");
  UI.summarizeTop5Btn.disabled = false;
  UI.summarizeTop5Btn.style.opacity = "1";
  UI.summaryCard.style.display = "none";
  UI.summaryList.innerHTML = "";
  UI.summaryList.style.display = "block";
  UI.reportFilterRow.style.display = "none";
  UI.reportArea.style.display = "none";
  UI.generateReportBtn.style.display = "none";
  if (UI.filterSimilarity) UI.filterSimilarity.value = "50";
  if (UI.filterPlatform) UI.filterPlatform.value = "";
  if (UI.filterYear) UI.filterYear.value = "";
  renderPageMeta();
  renderKeywordList();
  setStatus(t("status-cleared"));
  savePanelState();
}

async function savePanelState() {
  const ps = {
    page: state.page,
    keywords: state.keywords,
    compareBatchIndex: state.compareBatchIndex,
    comparedItems: state.comparedItems,
    summaryHtml: UI.summaryList.innerHTML,
    contentSectionVisible: UI.contentSection.style.display !== "none",
    summarizeTop5BtnVisible: UI.summarizeTop5Btn.style.display !== "none",
    summarizeTop5BtnDisabled: UI.summarizeTop5Btn.disabled,
    summarizeTop5BtnOpacity: UI.summarizeTop5Btn.style.opacity,
    summarizeTop5BtnNextMode: state.compareBatchIndex > 0,
    summaryCardVisible: UI.summaryCard.style.display !== "none",
    generateReportBtnVisible: UI.generateReportBtn.style.display !== "none"
  };
  await chrome.storage.local.set({ [STORAGE_KEYS.panelState]: ps });
}

async function restorePanelState() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.panelState);
  const ps = result[STORAGE_KEYS.panelState];
  if (!ps || !ps.contentSectionVisible) return;

  state.page = ps.page || null;
  state.keywords = ps.keywords || [];
  state.compareBatchIndex = ps.compareBatchIndex || 0;
  state.comparedItems = ps.comparedItems || [];

  UI.contentSection.style.display = "flex";
  renderPageMeta();
  renderKeywordList();

  if (ps.summarizeTop5BtnVisible) {
    UI.summarizeTop5Btn.style.display = "block";
    UI.summarizeTop5Btn.textContent = ps.summarizeTop5BtnNextMode ? t("summarize-next5") : t("summarize-top5");
    UI.summarizeTop5Btn.disabled = ps.summarizeTop5BtnDisabled || false;
    UI.summarizeTop5Btn.style.opacity = ps.summarizeTop5BtnOpacity || "1";
  }

  if (ps.summaryCardVisible && ps.summaryHtml) {
    UI.summaryList.innerHTML = ps.summaryHtml;
    UI.summaryCard.style.display = "block";
  }

  if (ps.generateReportBtnVisible) {
    UI.generateReportBtn.style.display = "inline-block";
  }
}

function parseSummaryFields(summaryText) {
  const txt = summaryText || "";
  const get = (...labels) => {
    for (const label of labels) {
      const m = txt.match(new RegExp(`${label}\\s*:\\s*(.+?)(?:\\n|$)`, "i"));
      if (m) return (m[1] || "").trim();
    }
    return "";
  };
  const simRaw  = get("相似程度\\(%\\)", "Similarity\\(%\\)");
  const createdRaw = get("Submitted Date", "Created");
  const yearMatch  = createdRaw.match(/\d{4}/);
  return {
    platform:     get("Platform"),
    problem:      get("Problem"),
    statusReason: get("Status \\/ Reason", "Status\\/Reason"),
    rootCause:    get("Root Cause"),
    solution:     get("Solution"),
    created:      (createdRaw && !/^unknown$/i.test(createdRaw)) ? createdRaw : "",
    year:         yearMatch ? parseInt(yearMatch[0]) : 0,
    similarity:   parseInt(simRaw) || 0
  };
}

function renderCompareSummaries(items, offset) {
  if (!Array.isArray(items) || !items.length) return;

  if (offset === 0) {
    state.comparedItems = [];
  }

  const blocks = items.map((item, idx) => {
    const num = offset + idx + 1;
    const fields = parseSummaryFields(item.summary || "");

    if (item.submittedDate) {
      fields.created = item.submittedDate;
      const yearMatch = item.submittedDate.match(/\d{4}/);
      if (yearMatch) fields.year = parseInt(yearMatch[0]);
    }

    state.comparedItems.push({
      index: num,
      title: item.title || "",
      url: item.url || "",
      fields,
      rawSummary: item.summary || ""
    });

    const title = escapeHtml(item.title || t("summary-item", { index: num }));
    const url = escapeHtml(item.url || "");

    const fieldDefs = [
      ["Platform",       fields.platform],
      ["Submitted Date", fields.created],
      ["Problem",        fields.problem],
      ["Status / Reason",fields.statusReason],
      ["Root Cause",     fields.rootCause],
      ["Solution",       fields.solution],
      ["Similarity(%)",  fields.similarity ? fields.similarity + "%" : ""]
    ];
    const fieldRows = fieldDefs
      .filter(([, v]) => v)
      .map(([k, v]) =>
        `<div style="font-size:11px; margin-bottom:2px;">` +
        `<span style="font-weight:600; color:#374151;">${escapeHtml(k)}:</span> ` +
        `${escapeHtml(String(v))}</div>`
      ).join("");

    return `<div style="margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid #e5e7eb;">
      <div style="font-weight:600; font-size:11px; color:#0f766e; margin-bottom:2px;">#${num}</div>
      <div style="font-weight:700; margin-bottom:4px;">${title}</div>
      <div style="font-size:11px; color:#64748b; margin-bottom:6px; word-break:break-all;">${url}</div>
      ${fieldRows}
    </div>`;
  });

  // offset=0 是第一批，清空後顯示；offset>0 是 append
  if (offset === 0) {
    UI.summaryList.innerHTML = blocks.join("");
  } else {
    const divider = `<div style="margin:10px 0 12px; border-top:2px dashed #0f766e; text-align:center; font-size:11px; color:#0f766e; padding-top:6px;">${t("batch-divider", { start: offset + 1, end: offset + items.length })}</div>`;
    UI.summaryList.innerHTML += divider + blocks.join("");
  }
  UI.summaryList.style.display = "block";
  UI.reportArea.style.display = "none";
  UI.summaryCard.style.display = "block";
  UI.generateReportBtn.style.display = "inline-block";
}

function renderSkeletonCards(total, offset) {
  const s = "background:linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%); background-size:200% 100%; animation:shimmer 1.5s ease-in-out infinite;";

  if (offset === 0) {
    UI.summaryList.innerHTML = "";
  } else if (!document.getElementById(`batch-divider-${offset}`)) {
    const dividerEl = document.createElement("div");
    dividerEl.id = `batch-divider-${offset}`;
    dividerEl.style.cssText = "margin:10px 0 12px; border-top:2px dashed #0f766e; text-align:center; font-size:11px; color:#0f766e; padding-top:6px;";
    dividerEl.textContent = t("batch-divider", { start: offset + 1, end: offset + total });
    UI.summaryList.appendChild(dividerEl);
  }

  for (let i = 0; i < total; i++) {
    const elId = `compare-item-${offset + i}`;
    if (document.getElementById(elId)) continue;
    const num = offset + i + 1;
    const el = document.createElement("div");
    el.id = elId;
    el.style.cssText = "margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid #e5e7eb;";
    el.innerHTML =
      `<div style="font-weight:600; font-size:11px; color:#0f766e; margin-bottom:6px;">#${num}</div>` +
      `<div style="height:11px; width:65%; border-radius:4px; ${s} margin-bottom:5px;"></div>` +
      `<div style="height:10px; width:45%; border-radius:4px; ${s} margin-bottom:5px;"></div>` +
      `<div style="height:10px; width:75%; border-radius:4px; ${s} margin-bottom:6px;"></div>` +
      `<div style="font-size:11px; color:#9ca3af;">⟳ ${t("skeleton-comparing")}</div>`;
    UI.summaryList.appendChild(el);
  }

  UI.summaryList.style.display = "block";
  UI.reportArea.style.display = "none";
  UI.summaryCard.style.display = "block";
  UI.generateReportBtn.style.display = "none";
}

function insertCompareItem(item, itemIndex, offset) {
  const num = offset + itemIndex + 1;
  const fields = parseSummaryFields(item.summary || "");
  if (item.submittedDate) {
    fields.created = item.submittedDate;
    const ym = item.submittedDate.match(/\d{4}/);
    if (ym) fields.year = parseInt(ym[0]);
  }

  // Ensure slot exists
  while (state.comparedItems.length <= offset + itemIndex) state.comparedItems.push(null);
  state.comparedItems[offset + itemIndex] = {
    index: num,
    title: item.title || "",
    url: item.url || "",
    fields,
    rawSummary: item.summary || ""
  };

  const title = escapeHtml(item.title || t("summary-item", { index: num }));
  const url = escapeHtml(item.url || "");
  const fieldDefs = [
    ["Platform",       fields.platform],
    ["Submitted Date", fields.created],
    ["Problem",        fields.problem],
    ["Status / Reason",fields.statusReason],
    ["Root Cause",     fields.rootCause],
    ["Solution",       fields.solution],
    ["Similarity(%)",  fields.similarity ? fields.similarity + "%" : ""]
  ];
  const fieldRows = fieldDefs
    .filter(([, v]) => v)
    .map(([k, v]) =>
      `<div style="font-size:11px; margin-bottom:2px;">` +
      `<span style="font-weight:600; color:#374151;">${escapeHtml(k)}:</span> ` +
      `${escapeHtml(String(v))}</div>`
    ).join("");

  const el = document.getElementById(`compare-item-${offset + itemIndex}`);
  if (el) {
    el.innerHTML =
      `<div style="font-weight:600; font-size:11px; color:#0f766e; margin-bottom:2px;">#${num}</div>` +
      `<div style="font-weight:700; margin-bottom:4px;">${title}</div>` +
      `<div style="font-size:11px; color:#64748b; margin-bottom:6px; word-break:break-all;">${url}</div>` +
      fieldRows;
  }

  state.summarizeProgress.done = Math.min(
    (state.summarizeProgress.done || 0) + 1,
    state.summarizeProgress.total
  );
  setStatus(t("status-summarizing-progress", {
    done: state.summarizeProgress.done,
    total: state.summarizeProgress.total
  }));
}

async function summarizeTopFiveResults() {
  if (!isValidApiKey(state.modelConfig.selectedApiKey) || !state.modelConfig.selectedModel) {
    setStatus(t("status-config-required"), true);
    openModelModal();
    return;
  }

  const offset = state.compareBatchIndex * COMPARE_BATCH_SIZE;
  const start = offset + 1;
  const end = offset + COMPARE_BATCH_SIZE;

  UI.summarizeTop5Btn.disabled = true;
  setStatus(t("status-summarizing", { start, end }));

  // Pre-allocate slots and render skeleton cards immediately
  if (offset === 0) {
    state.comparedItems = new Array(COMPARE_BATCH_SIZE).fill(null);
  } else {
    for (let i = 0; i < COMPARE_BATCH_SIZE; i++) state.comparedItems.push(null);
  }
  state.summarizeProgress = { done: 0, total: COMPARE_BATCH_SIZE, offset };
  renderSkeletonCards(COMPARE_BATCH_SIZE, offset);

  const response = await sendRuntimeMessage({
    type: MESSAGE_TYPES.SUMMARIZE_TOP5_RESULTS,
    language: state.currentLanguage,
    offset
  });

  UI.summarizeTop5Btn.disabled = false;

  if (!response.ok) {
    for (let i = 0; i < COMPARE_BATCH_SIZE; i++) {
      const el = document.getElementById(`compare-item-${offset + i}`);
      if (el) el.remove();
    }
    state.comparedItems = state.comparedItems.slice(0, offset).filter(Boolean);
    if (!state.comparedItems.length) UI.summaryCard.style.display = "none";
    setStatus(t("status-summary-failed", { error: response.error }), true);
    return;
  }

  const items = response.items || [];

  if (!items.length) {
    for (let i = 0; i < COMPARE_BATCH_SIZE; i++) {
      const el = document.getElementById(`compare-item-${offset + i}`);
      if (el) el.remove();
    }
    state.comparedItems = state.comparedItems.slice(0, offset).filter(Boolean);
    if (!state.comparedItems.length) UI.summaryCard.style.display = "none";
    UI.summarizeTop5Btn.disabled = true;
    UI.summarizeTop5Btn.style.opacity = "0.5";
    setStatus(t("status-summary-all-done"));
    await savePanelState();
    return;
  }

  // Fallback: fill any slots not yet updated by progress messages
  items.forEach((item, i) => {
    if (!state.comparedItems[offset + i]) {
      insertCompareItem(item, i, offset);
    }
  });

  // Remove extra skeleton slots (if actual batch < COMPARE_BATCH_SIZE)
  for (let i = items.length; i < COMPARE_BATCH_SIZE; i++) {
    const el = document.getElementById(`compare-item-${offset + i}`);
    if (el) el.remove();
  }
  state.comparedItems = state.comparedItems.slice(0, offset + items.length).filter(Boolean);

  incrementModelUsage(state.modelConfig.selectedModel, items.length);
  state.compareBatchIndex += 1;
  UI.summarizeTop5Btn.textContent = t("summarize-next5");
  setStatus(t("status-summary-done"));
  UI.generateReportBtn.style.display = "inline-block";
  await savePanelState();
}

function getReportFilterValues() {
  const minSim = parseInt(UI.filterSimilarity.value) || 0;
  const platformFilter = (UI.filterPlatform.value || "").trim().toLowerCase();
  const minYear = parseInt(UI.filterYear.value) || 0;
  return { minSim, platformFilter, minYear };
}

function filterComparedItems({ minSim, platformFilter, minYear }) {
  return state.comparedItems.filter((item) => {
    if (item.fields.similarity < minSim) return false;
    if (platformFilter && !item.fields.platform.toLowerCase().includes(platformFilter)) return false;
    if (minYear > 0 && item.fields.year > 0 && item.fields.year < minYear) return false;
    return true;
  });
}

function buildItemBlock(item) {
  const f = item.fields;
  const fieldDefs = [
    ["Platform",        f.platform],
    ["Submitted Date",  f.created],
    ["Problem",         f.problem],
    ["Status / Reason", f.statusReason],
    ["Root Cause",      f.rootCause],
    ["Solution",        f.solution],
    ["Similarity(%)",   f.similarity ? f.similarity + "%" : ""]
  ];
  const fieldRows = fieldDefs
    .filter(([, v]) => v)
    .map(([k, v]) =>
      `<div style="font-size:11px; margin-bottom:2px;">` +
      `<span style="font-weight:600; color:#374151;">${escapeHtml(k)}:</span> ` +
      `${escapeHtml(String(v))}</div>`
    ).join("");
  return `<div style="margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid #e5e7eb;">
    <div style="font-weight:600; font-size:11px; color:#0f766e; margin-bottom:2px;">#${item.index}</div>
    <div style="font-weight:700; margin-bottom:4px;">${escapeHtml(item.title)}</div>
    <div style="font-size:11px; color:#64748b; margin-bottom:6px; word-break:break-all;">${escapeHtml(item.url)}</div>
    ${fieldRows}
  </div>`;
}

function renderReport() {
  const filters = getReportFilterValues();
  const filtered = filterComparedItems(filters);

  UI.reportStats.textContent = t("report-stats", { kept: filtered.length, total: state.comparedItems.length });

  if (!filtered.length) {
    UI.reportList.innerHTML = `<div style="color:#64748b; font-size:11px; text-align:center; padding:12px;">${t("report-empty")}</div>`;
  } else {
    UI.reportList.innerHTML = filtered.map(buildItemBlock).join("");
  }

  UI.summaryList.style.display = "none";
  UI.reportArea.style.display = "block";
}

function buildReportText(filtered) {
  return filtered.map((item) => {
    const f = item.fields;
    return [
      `#${item.index} ${item.title}`,
      `URL: ${item.url}`,
      f.platform     ? `Platform: ${f.platform}`            : "",
      f.created      ? `Submitted Date: ${f.created}`      : "",
      f.problem      ? `Problem: ${f.problem}`              : "",
      f.statusReason ? `Status / Reason: ${f.statusReason}` : "",
      f.rootCause    ? `Root Cause: ${f.rootCause}`         : "",
      f.solution     ? `Solution: ${f.solution}`            : "",
      `Similarity: ${f.similarity}%`
    ].filter(Boolean).join("\n");
  }).join("\n\n---\n\n");
}

function bindEvents() {
  UI.titleBtn.addEventListener("click", openModelModal);
  UI.clearBtn.addEventListener("click", clearPanel);
  UI.languageSelect.addEventListener("change", async () => {
    const readyTexts = [
      TRANSLATIONS["zh-TW"]["status-ready"],
      TRANSLATIONS["zh-CN"]["status-ready"],
      TRANSLATIONS.en["status-ready"]
    ];
    const wasReadyStatus = readyTexts.includes(UI.statusText.textContent) || UI.statusText.getAttribute("data-i18n") === "status-ready";
    state.currentLanguage = UI.languageSelect.value;
    applyLanguage();
    await saveLanguage(state.currentLanguage);
    if (wasReadyStatus) {
      setStatus(t("status-ready"));
    }
  });
  UI.modelModal.addEventListener("click", (event) => {
    if (event.target === UI.modelModal) closeModelModal();
  });
  UI.closeModelBtn.addEventListener("click", closeModelModal);
  UI.cancelModelBtn.addEventListener("click", closeModelModal);
  UI.saveModelBtn.addEventListener("click", saveModelConfig);
  UI.reloadBtn.addEventListener("click", loadActiveHsdPage);
  UI.loadClipboardBtn.addEventListener("click", loadClipboardContent);
  UI.addKeywordBtn.addEventListener("click", () => {
    state.keywords.push("");
    renderKeywordList();
  });
  UI.searchBtn.addEventListener("click", searchSimilarSighting);
  UI.summarizeTop5Btn.addEventListener("click", summarizeTopFiveResults);

  // 整理報告 — 切換過濾器列顯示
  UI.generateReportBtn.addEventListener("click", () => {
    const isVisible = UI.reportFilterRow.style.display !== "none";
    if (isVisible) {
      UI.reportFilterRow.style.display = "none";
      UI.reportArea.style.display = "none";
      UI.summaryList.style.display = "block";
    } else {
      UI.reportFilterRow.style.display = "block";
    }
  });

  UI.applyReportBtn.addEventListener("click", renderReport);

  UI.resetReportBtn.addEventListener("click", () => {
    UI.filterSimilarity.value = "50";
    UI.filterPlatform.value = "";
    UI.filterYear.value = "";
    UI.reportArea.style.display = "none";
    UI.summaryList.style.display = "block";
  });

  UI.copyReportBtn.addEventListener("click", () => {
    const filters = getReportFilterValues();
    const filtered = filterComparedItems(filters);
    const text = buildReportText(filtered);
    navigator.clipboard.writeText(text).then(() => {
      const orig = UI.copyReportBtn.textContent;
      UI.copyReportBtn.textContent = t("copy-report-done");
      setTimeout(() => { UI.copyReportBtn.textContent = orig; }, 2000);
    });
  });
}

chrome.runtime.onMessage.addListener((message, _sender) => {
  if (message?.type === MESSAGE_TYPES.SUMMARIZE_ITEM_PROGRESS &&
      message.phase === "item" &&
      message.offset === state.summarizeProgress.offset) {
    insertCompareItem(message.item, message.itemIndex, message.offset);
  }
});

async function init() {
  await loadLanguage();
  bindEvents();
  applyLanguage();
  await loadSettings();
  await loadModelConfig();
  if (isValidApiKey(state.modelConfig.selectedApiKey)) {
    UI.apiKeyInput.value = state.modelConfig.selectedApiKey;
    await refreshModels();
  }
  UI.contentSection.style.display = "none";
  UI.summarizeTop5Btn.style.display = "none";
  renderKeywordList();
  renderPageMeta();
  setStatus(t("status-ready"));
  await restorePanelState();
}

init();
