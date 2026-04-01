const STORAGE_KEYS = {
  keywordCount: "keywordCount",
  defaultKeywords: "defaultKeywords",
  selectedApiKey: "selectedApiKey",
  selectedModel: "selectedModel"
};

const DEFAULTS = {
  keywordCount: 3,
  defaultKeywords: [],
  selectedApiKey: "",
  selectedModel: "gpt-4o"
};

const COMPARE_BATCH_SIZE = 5;

const OPENAI_BASE_URL = "https://expertgpt.intel.com/v1";
const ANTHROPIC_BASE_URL = "https://expertgpt.intel.com/anthropic/v1";
const GNAI_OPENAI_BASE_URL = "https://gnai.intel.com/api/providers/openai/v1";
const GNAI_ANTHROPIC_BASE_URL = "https://gnai.intel.com/api/providers/anthropic";
const REQUEST_TIMEOUT_MS = 20000;

const GNAI_OPENAI_MODELS = ["gpt-4o", "gpt-4.1", "gpt-5-mini", "gpt-5-nano", "o3-mini"];
const GNAI_ANTHROPIC_MODELS = ["claude-4-6-opus", "claude-4-6-sonnet", "claude-4-5-opus", "claude-4-5-sonnet", "claude-4-5-haiku"];

function isGnaiKey(apiKey) {
  return typeof apiKey === "string" && apiKey.length > 0 && !apiKey.startsWith("pak_");
}

function isAnthropicModel(model) {
  return typeof model === "string" && model.toLowerCase().startsWith("claude");
}

const MESSAGE_TYPES = {
  GET_ACTIVE_HSD_PAGE: "GET_ACTIVE_HSD_PAGE",
  OPEN_HSD_ARTICLE_PAGE: "OPEN_HSD_ARTICLE_PAGE",
  GET_SETTINGS: "GET_SETTINGS",
  SAVE_SETTINGS: "SAVE_SETTINGS",
  SEARCH_SIMILAR_SIGHTING: "SEARCH_SIMILAR_SIGHTING",
  SUMMARIZE_TOP5_RESULTS: "SUMMARIZE_TOP5_RESULTS",
  SUMMARIZE_ITEM_PROGRESS: "SUMMARIZE_ITEM_PROGRESS",
  CLOSE_FILTERED_TABS: "CLOSE_FILTERED_TABS",
  RETRY_SINGLE_ITEM: "RETRY_SINGLE_ITEM",
  GET_MODELS: "GET_MODELS",
  GET_MODEL_CONFIG: "GET_MODEL_CONFIG",
  SAVE_MODEL_CONFIG: "SAVE_MODEL_CONFIG"
};

function getConciseSummaryPrompt(language) {
  const prompts = {
    "zh-TW": "請用簡短的條列式摘要載入的內容，使用繁體中文，重點放在關鍵概念上。",
    "zh-CN": "请用简短的条列式摘要载入的内容，使用简体中文，重点放在关键概念上。",
    en: "Please summarize the loaded content using short bullet points in English, focusing on key concepts."
  };

  return prompts[language] || prompts["zh-TW"];
}

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

function isHsdUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("hsdes.intel.com");
  } catch (_err) {
    return false;
  }
}

function normalizeKeyword(token) {
  return String(token || "")
    .trim()
    .replace(/[\u3000\s]+/g, " ")
    .replace(/^[-_\W]+|[-_\W]+$/g, "");
}

function isValidApiKey(apiKey) {
  if (typeof apiKey !== "string" || !apiKey.trim()) return false;
  if (apiKey.startsWith("pak_")) return apiKey.length > 8;
  return apiKey.length > 0;
}

function normalizeKeywordCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULTS.keywordCount;
  }
  return Math.min(10, Math.max(1, Math.round(parsed)));
}

function parseKeywordsFromModelText(text, count) {
  const cleanedText = String(text || "").trim();

  try {
    const parsed = JSON.parse(cleanedText);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeKeyword).filter(Boolean).slice(0, Math.max(1, count));
    }
  } catch (_err) {
    // Fall through to plain-text parsing.
  }

  return cleanedText
    .split(/[,\n]/)
    .map((s) => normalizeKeyword(s.replace(/^[-*\d.\s]+/, "")))
    .filter(Boolean)
    .slice(0, Math.max(1, count));
}

function dedupeKeywords(keywords) {
  const result = [];
  const seen = new Set();
  (keywords || []).forEach((keyword) => {
    const normalized = normalizeKeyword(keyword);
    const key = normalized.toLowerCase();
    if (normalized && !seen.has(key)) {
      result.push(normalized);
      seen.add(key);
    }
  });
  return result;
}

function detectPrimaryContextKeyword(rawText) {
  const text = String(rawText || "").toUpperCase();
  const knownPlatforms = [
    "WCL", "PTL", "ARL", "MTL", "LNL", "RPL", "ADL", "TGL", "ICL", "SPR", "EMR", "GNR", "SRF", "CLR"
  ];
  const knownProducts = ["IGS", "IPU", "VPU", "DG2", "PVC", "GAUDI"];

  for (const platform of knownPlatforms) {
    const re = new RegExp(`\\b${platform}\\b`, "i");
    if (re.test(text)) {
      return platform;
    }
  }

  for (const product of knownProducts) {
    const re = new RegExp(`\\b${product}\\b`, "i");
    if (re.test(text)) {
      return product;
    }
  }

  return "";
}

function isFormatOrPersonLikeKeyword(keyword) {
  const token = String(keyword || "").trim();
  if (!token) return true;

  const lower = token.toLowerCase();

  const formatLike = [
    // HSD 表單欄位名
    "hsd", "hsdes", "title", "summary", "description", "steps", "expected", "actual", "owner", "assignee",
    "priority", "severity", "component", "module", "format", "template", "attachment", "comment", "status",
    // 檔案格式 / 資料格式
    "json", "yaml", "yml", "xml", "html", "csv", "txt", "log", "pdf", "xlsx", "xls", "doc", "docx",
    "conf", "config", "ini", "toml", "proto", "wasm", "bin", "elf", "hex", "tar", "zip", "gz",
    // 通用技術詞 / protocol
    "http", "https", "ftp", "ssh", "tcp", "udp", "grpc", "rest", "soap", "api", "sdk", "abi",
    "url", "uri", "uuid", "guid", "null", "none", "true", "false", "nan", "inf",
    "string", "int", "float", "bool", "boolean", "char", "byte", "array", "list", "dict", "map", "set",
    "object", "class", "struct", "enum", "void", "type", "var", "let", "const",
    // 泛用動詞/名詞
    "error", "fail", "failed", "pass", "passed", "test", "debug", "info", "warn", "warning",
    "result", "output", "input", "value", "data", "file", "path", "line", "code", "run", "set", "get",
    "check", "update", "fix", "patch", "report", "note", "case", "step"
  ];

  if (formatLike.includes(lower)) {
    return true;
  }

  // Date-like keywords: 2024-03-21, 03/21/2024, 20240321, Mar-2026
  if (/^\d{4}[-/.]\d{1,2}([-/ .]\d{1,2})?$/.test(token)) return true;
  if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}$/.test(token)) return true;
  if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[-\s]?\d{2,4}$/i.test(token)) return true;
  if (/^20\d{6}$/.test(token)) return true;

  // Version/build-like keywords: v1.2.3, 1.0.0, r23, build1234, bkc1.4
  if (/^(v|ver|version|rev|r)\s?\d+(\.\d+){0,3}$/i.test(token)) return true;
  if (/^\d+(\.\d+){1,3}$/.test(token)) return true;
  if (/^(build|bkc|ww|prq)\s?[-_]?\d+(\.\d+)*$/i.test(token)) return true;

  // Person-like names or aliases: "john smith", "j_smith", "a12345"
  if (/^[a-z]{2,}\s+[a-z]{2,}(\s+[a-z]{2,})?$/i.test(token)) {
    return true;
  }
  if (/^[a-z]{1,3}_[a-z0-9]{2,}$/i.test(token)) {
    return true;
  }
  if (/^[a-z]\d{4,}$/i.test(token)) {
    return true;
  }

  return false;
}

function applyKeywordPolicy(rawText, keywords, keywordCount) {
  const safeKeywordCount = normalizeKeywordCount(keywordCount);
  const primaryKeyword = detectPrimaryContextKeyword(rawText);

  let filtered = dedupeKeywords(keywords).filter((kw) => !isFormatOrPersonLikeKeyword(kw));

  if (primaryKeyword) {
    const primaryLower = primaryKeyword.toLowerCase();
    filtered = [primaryKeyword, ...filtered.filter((kw) => kw.toLowerCase() !== primaryLower)];
  }

  return filtered.slice(0, safeKeywordCount);
}

function extractIssueCandidatesFromText(rawText, keywordCount) {
  const safeKeywordCount = normalizeKeywordCount(keywordCount);
  const text = String(rawText || "")
    .toLowerCase()
    .replace(/[^a-z0-9_\-\s]/g, " ");

  const stopWords = new Set([
    "the", "and", "for", "with", "this", "that", "from", "into", "your", "have", "been", "when", "where",
    "what", "which", "would", "could", "should", "about", "after", "before", "while", "is", "are", "was",
    "were", "to", "of", "in", "on", "at", "by", "or", "an", "a", "as", "it", "be", "if", "we", "you",
    "issue", "problem", "hsd", "hsdes", "intel", "title", "summary", "description", "owner", "assignee"
  ]);

  const freq = new Map();
  text.split(/\s+/).forEach((word) => {
    const token = normalizeKeyword(word);
    if (!token) return;
    if (token.length < 3) return;
    if (/^\d+$/.test(token)) return;
    if (stopWords.has(token)) return;
    if (isFormatOrPersonLikeKeyword(token)) return;
    freq.set(token, (freq.get(token) || 0) + 1);
  });

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token)
    .slice(0, safeKeywordCount * 3);
}

// 從原文中抓取所有 BSOD bug check error codes (0x9F, 0x3B, 0x116...)
// 回傳去重且正規化大寫的陣列，例如 ["0x9F", "0x3B"]
function extractBsodCodes(rawText) {
  const text = String(rawText || "");
  const matches = text.match(/\b0x[0-9A-Fa-f]{2,8}\b/gi) || [];
  const seen = new Set();
  const result = [];
  for (const m of matches) {
    const norm = m.toUpperCase().replace(/^0X/, "0x");
    // 過濾掉太長(>8碼)或純0(如0x0000)只有0的情況
    const hexPart = norm.slice(2);
    if (/^0+$/.test(hexPart)) continue;
    if (!seen.has(norm)) {
      seen.add(norm);
      result.push(norm);
    }
  }
  return result;
}

// 將 BSOD codes 強制插入 keywords（放在 platform 後），不重複
function injectBsodCodesIntoKeywords(keywords, bsodCodes) {
  if (!bsodCodes.length) return keywords;

  const normalized = keywords.map((k) => k.toUpperCase());
  const toInject = bsodCodes.filter((c) => !normalized.includes(c.toUpperCase()));

  if (!toInject.length) return keywords;

  // platform keyword 排第一，BSOD codes 緊接在後，其餘順延
  const [first, ...rest] = keywords;
  return [first, ...toInject, ...rest].filter(Boolean);
}

function fillKeywordsToCount(rawText, keywords, keywordCount) {
  const safeKeywordCount = normalizeKeywordCount(keywordCount);
  const base = applyKeywordPolicy(rawText, keywords, safeKeywordCount);
  if (base.length >= safeKeywordCount) {
    return base.slice(0, safeKeywordCount);
  }

  const candidates = extractIssueCandidatesFromText(rawText, safeKeywordCount);
  const merged = [...base];

  for (const candidate of candidates) {
    if (merged.length >= safeKeywordCount) break;
    if (!merged.includes(candidate)) {
      merged.push(candidate);
    }
  }

  return applyKeywordPolicy(rawText, merged, safeKeywordCount);
}

function assertApiKey(apiKey) {
  if (!isValidApiKey(apiKey)) {
    throw new Error("Invalid API key. Use pak_ key (ExpertGPT) or a GNAI key");
  }
}

async function fetchJson(baseUrl, path, apiKey, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body,
      signal: controller.signal
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`${path} failed (${response.status}): ${text}`);
    }

    return response.json();
  } catch (err) {
    if (err && err.name === "AbortError") {
      throw new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchModels(apiKey) {
  if (isGnaiKey(apiKey)) return GNAI_OPENAI_MODELS;
  assertApiKey(apiKey);
  const data = await fetchJson(OPENAI_BASE_URL, "/models", apiKey);
  return (data.data || [])
    .map((m) => String(m?.id || "").trim())
    .filter(Boolean);
}

async function fetchAnthropicModels(apiKey) {
  if (isGnaiKey(apiKey)) return GNAI_ANTHROPIC_MODELS;
  assertApiKey(apiKey);
  const data = await fetchJson(ANTHROPIC_BASE_URL, "/models", apiKey);
  return (data.data || [])
    .map((m) => String(m?.id || "").trim())
    .filter(Boolean);
}

async function callChatCompletionApi(apiKey, model, messages, { maxTokens = 700, temperature = 0.2 } = {}) {
  // Anthropic model: route to appropriate Anthropic endpoint
  if (isAnthropicModel(model)) {
    const anthropicBase = isGnaiKey(apiKey) ? GNAI_ANTHROPIC_BASE_URL : ANTHROPIC_BASE_URL;
    const anthropicPath = isGnaiKey(apiKey) ? "/v1/messages" : "/messages";
    const systemMsg = messages.find((m) => m.role === "system");
    const userMsgs = messages.filter((m) => m.role !== "system");
    const body = {
      model,
      system: systemMsg ? systemMsg.content : "",
      messages: userMsgs,
      max_tokens: maxTokens
    };
    const data = await fetchJson(anthropicBase, anthropicPath, apiKey, {
      method: "POST",
      body: JSON.stringify(body)
    });
    return data?.content?.[0]?.text || "";
  }

  // OpenAI-compat model
  const baseUrl = isGnaiKey(apiKey) ? GNAI_OPENAI_BASE_URL : OPENAI_BASE_URL;
  const body = {
    model,
    messages,
    stream: false,
    temperature,
    max_tokens: maxTokens
  };
  const data = await fetchJson(baseUrl, "/chat/completions", apiKey, {
    method: "POST",
    body: JSON.stringify(body)
  });
  return data?.choices?.[0]?.message?.content || "";
}

async function fetchQuota(apiKey) {
  assertApiKey(apiKey);
  return fetchJson(OPENAI_BASE_URL, "/quota", apiKey);
}

function mapModelCostCapFromQuota(quota) {
  const modelQuotas = quota?.model_quotas || {};
  const mapped = {};

  Object.keys(modelQuotas).forEach((model) => {
    const info = modelQuotas[model] || {};
    const cost = Number(info.cost ?? info.used ?? 0);
    const cap = Number(info.cap ?? info.limit ?? 0);
    mapped[model] = { cost, cap };
  });

  return mapped;
}

async function extractKeywordsByModel(rawText, keywordCount, apiKey, model) {
  assertApiKey(apiKey);

  const safeKeywordCount = normalizeKeywordCount(keywordCount);

  const prompt = [
    "You are extracting issue-search keywords from an HSD (hardware/software debug) page.",
    `Return exactly ${safeKeywordCount} short keywords as JSON array of strings.`,
    "The first keyword MUST be platform/codename if present (examples: WCL, PTL, ARL, MTL, LNL, RPL, ADL), otherwise Intel product name (e.g., IGS, IPU, VPU).",
    "Keywords must describe the SPECIFIC issue: symptom, root cause, failing hardware block, or affected software feature.",
    "STRICTLY FORBIDDEN from appearing in the keyword list:",
    "- File/data formats: json, xml, yaml, csv, log, bin, elf, pdf, xlsx, etc.",
    "- Network/API protocols: http, https, grpc, rest, tcp, udp, api, sdk, url, etc.",
    "- Generic programming terms: null, true, false, error, string, int, float, array, dict, etc.",
    "- Generic action verbs: check, update, fix, run, get, set, test, pass, fail, etc.",
    "- Formatting fields: title, summary, description, steps, expected, actual, status, owner, etc.",
    "- Person names, user aliases, dates, version/build numbers.",
    "Rules:",
    "1) Keep platform/product keyword in canonical uppercase (e.g., WCL, IGS)",
    "2) No duplicates",
    "3) Each keyword 1-3 words, describing specific hardware/software phenomena",
    "4) Output JSON array only, no explanation"
  ].join("\n");

  const body = {
    model: model || DEFAULTS.selectedModel,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: String(rawText || "").slice(0, 16000) }
    ],
    stream: false,
    temperature: 0.2,
    max_tokens: 220
  };

  const content = await callChatCompletionApi(apiKey, body.model, body.messages, { maxTokens: 220, temperature: 0.2 });
  const parsed = fillKeywordsToCount(rawText, parseKeywordsFromModelText(content, safeKeywordCount), safeKeywordCount);
  if (!parsed.length) {
    throw new Error("Model returned unparseable keywords");
  }

  if (parsed.length < safeKeywordCount) {
    const repairPrompt = [
      `You returned only ${parsed.length} keywords, but ${safeKeywordCount} are required.`,
      `Return exactly ${safeKeywordCount} keywords as JSON array only.`,
      "No explanation."
    ].join("\n");

    const repairBody = {
      model: model || DEFAULTS.selectedModel,
      messages: [
        { role: "system", content: repairPrompt },
        { role: "user", content: String(rawText || "").slice(0, 16000) }
      ],
      stream: false,
      temperature: 0.2,
      max_tokens: 220
    };

    const repairContent = await callChatCompletionApi(apiKey, repairBody.model, repairBody.messages, { maxTokens: 220, temperature: 0.2 });
    const repaired = fillKeywordsToCount(rawText, parseKeywordsFromModelText(repairContent, safeKeywordCount), safeKeywordCount);
    if (repaired.length >= safeKeywordCount) {
      return injectBsodCodesIntoKeywords(repaired.slice(0, safeKeywordCount), extractBsodCodes(rawText));
    }
  }

  const filled = fillKeywordsToCount(rawText, parsed, safeKeywordCount);
  if (filled.length < safeKeywordCount) {
    throw new Error(`Insufficient keywords: got ${filled.length}/${safeKeywordCount}. Please reload the page and try again.`);
  }

  return injectBsodCodesIntoKeywords(filled.slice(0, safeKeywordCount), extractBsodCodes(rawText));
}

async function summarizeContentByModel({ title, url, text, apiKey, model, language }) {
  const prompt = getConciseSummaryPrompt(language);
  const userContent = `Page Title: ${title || ""}\nPage URL: ${url || ""}\n\nPage Content:\n${String(text || "").slice(0, 16000)}\n\n---\n\nPlease provide the concise summary.`;

  const body = {
    model: model || DEFAULTS.selectedModel,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: userContent }
    ],
    stream: false,
    temperature: 0.2,
    max_tokens: 700
  };

  const result = await callChatCompletionApi(apiKey, body.model, body.messages, { maxTokens: 700, temperature: 0.2 });
  return result || "(No summary content)";
}

async function summarizeComparedToOriginal({
  original,
  target,
  apiKey,
  model,
  language
}) {
  const promptByLang = {
    "zh-TW": [
      "你是 HSD 相似問題比較助理。",
      "請比較『原始 sighting』與『候選 sighting』，只回傳精簡結論。",
        "所有欄位的內容（值）一律使用繁體中文回答，欄位名稱保持原樣。",
      "Platform 只能填 Intel IC 平台代號/型號，例如 WCL, LNL, PTL, ARL, MTL, RPL, ADL, TGL, ICL, SPR, EMR, GNR。",
      "不要填 bug category、module name、component name、client_platf.bug 這類欄位值。若無法明確判定平台，請填 Unknown。",
      "輸出格式固定為（每項一行）：",
      "Platform: <平台代號或產品>",
      "Problem: <一句話描述候選問題>",
      "Status / Reason: <直接摘取候選 sighting 頁面中的 status 與 reason 欄位原始文字，例如 rejected / not_a_defect。若未提及則寫 Unknown>",
      "Root Cause: <根本原因，若未提及則寫 Unknown>",
      "Solution: <簡述解決方式，若未解決則寫 N/A>",
      "Submitted Date: <從頁面中找出 sighting 的建立日期，格式 YYYY-MM-DD 或 YYYY，若未提及則寫 Unknown>",
      "相似程度(%): <0-100 的整數>"
    ].join("\n"),
    "zh-CN": [
      "你是 HSD 相似问题比较助理。",
      "请比较『原始 sighting』与『候选 sighting』，只回传精简结论。",
        "所有字段的内容（值）一律使用简体中文回答，字段名称保持原样。",
      "Platform 只能填写 Intel IC 平台代号/型号，例如 WCL, LNL, PTL, ARL, MTL, RPL, ADL, TGL, ICL, SPR, EMR, GNR。",
      "不要填写 bug category、module name、component name、client_platf.bug 这类字段值。若无法明确判定平台，请填写 Unknown。",
      "输出格式固定为（每项一行）：",
      "Platform: <平台代号或产品>",
      "Problem: <一句话描述候选问题>",
      "Status / Reason: <直接擷取候选 sighting 页面中的 status 与 reason 字段原始文字，例如 rejected / not_a_defect。若未提及则写 Unknown>",
      "Root Cause: <根本原因，若未提及则写 Unknown>",
      "Solution: <简述解决方式，若未解决则写 N/A>",
      "Submitted Date: <从页面中找出 sighting 的建立日期，格式 YYYY-MM-DD 或 YYYY，若未提及则写 Unknown>",
      "相似程度(%): <0-100 的整数>"
    ].join("\n"),
    en: [
      "You are an HSD similar-sighting comparison assistant.",
      "Compare the Original sighting and the Candidate sighting.",
      "Platform must be the Intel IC platform codename/model only, such as WCL, LNL, PTL, ARL, MTL, RPL, ADL, TGL, ICL, SPR, EMR, or GNR.",
      "Do not use bug category, module name, component name, or field values like client_platf.bug. If the platform is not clearly identifiable, write Unknown.",
      "Return concise output in this exact format (one item per line):",
      "Platform: <platform or product>",
      "Problem: <one sentence about candidate issue>",
      "Status / Reason: <extract the raw status and reason field values directly from the candidate sighting page, e.g. rejected / not_a_defect. If not found, write Unknown>",
      "Root Cause: <root cause if mentioned, otherwise Unknown>",
      "Solution: <brief description of fix, or N/A if unresolved>",
      "Submitted Date: <creation date found in the sighting page, format YYYY-MM-DD or YYYY. If not found, write Unknown>",
      "Similarity(%): <integer 0-100>"
    ].join("\n")
  };

  const systemPrompt = promptByLang[language] || promptByLang["zh-TW"];

  const userContent = [
    "[Original Sighting]",
    `Title: ${original?.title || ""}`,
    `URL: ${original?.url || ""}`,
    `Content:\n${String(original?.text || "").slice(0, 12000)}`,
    "",
    "[Candidate Sighting]",
    `Title: ${target?.title || ""}`,
    `URL: ${target?.url || ""}`,
    `Content:\n${String(target?.text || "").slice(0, 12000)}`
  ].join("\n");

  const body = {
    model: model || DEFAULTS.selectedModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    stream: false,
    temperature: 0.2,
    max_tokens: 1000
  };

  const result = await callChatCompletionApi(apiKey, body.model, body.messages, { maxTokens: 1000, temperature: 0.2 });
  return result || "(No comparison summary content)";
}

async function getSettings() {
  const stored = await chrome.storage.local.get([
    STORAGE_KEYS.keywordCount,
    STORAGE_KEYS.defaultKeywords,
    STORAGE_KEYS.selectedApiKey,
    STORAGE_KEYS.selectedModel
  ]);
  const keywordCount = normalizeKeywordCount(stored[STORAGE_KEYS.keywordCount]);

  const defaultKeywords = Array.isArray(stored[STORAGE_KEYS.defaultKeywords])
    ? stored[STORAGE_KEYS.defaultKeywords].map(normalizeKeyword).filter(Boolean)
    : DEFAULTS.defaultKeywords;

  return {
    keywordCount,
    defaultKeywords,
    selectedApiKey: typeof stored[STORAGE_KEYS.selectedApiKey] === "string"
      ? stored[STORAGE_KEYS.selectedApiKey]
      : DEFAULTS.selectedApiKey,
    selectedModel: typeof stored[STORAGE_KEYS.selectedModel] === "string" && stored[STORAGE_KEYS.selectedModel]
      ? stored[STORAGE_KEYS.selectedModel]
      : DEFAULTS.selectedModel
  };
}

async function saveSettings({ keywordCount, defaultKeywords }) {
  const safeCount = normalizeKeywordCount(keywordCount);
  const safeKeywords = Array.isArray(defaultKeywords)
    ? defaultKeywords.map(normalizeKeyword).filter(Boolean)
    : [];

  await chrome.storage.local.set({
    [STORAGE_KEYS.keywordCount]: safeCount,
    [STORAGE_KEYS.defaultKeywords]: safeKeywords
  });

  return { keywordCount: safeCount, defaultKeywords: safeKeywords };
}

async function getModelConfig() {
  const stored = await chrome.storage.local.get([STORAGE_KEYS.selectedApiKey, STORAGE_KEYS.selectedModel]);
  return {
    selectedApiKey: typeof stored[STORAGE_KEYS.selectedApiKey] === "string"
      ? stored[STORAGE_KEYS.selectedApiKey]
      : DEFAULTS.selectedApiKey,
    selectedModel: typeof stored[STORAGE_KEYS.selectedModel] === "string" && stored[STORAGE_KEYS.selectedModel]
      ? stored[STORAGE_KEYS.selectedModel]
      : DEFAULTS.selectedModel
  };
}

async function saveModelConfig({ selectedApiKey, selectedModel }) {
  const safeApiKey = typeof selectedApiKey === "string" ? selectedApiKey.trim() : "";
  const safeModel = typeof selectedModel === "string" && selectedModel.trim()
    ? selectedModel.trim()
    : "";

  if (safeApiKey && !isValidApiKey(safeApiKey)) {
    throw new Error("Invalid API key format");
  }

  if (!safeModel) {
    throw new Error("Please select a model first");
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.selectedApiKey]: safeApiKey,
    [STORAGE_KEYS.selectedModel]: safeModel
  });

  return { selectedApiKey: safeApiKey, selectedModel: safeModel };
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function getActiveHsdPage({ clipboardText = "", language = "zh-TW" } = {}) {
  const settings = await getSettings();
  const modelConfig = await getModelConfig();

  if (!isValidApiKey(modelConfig.selectedApiKey)) {
    throw new Error("Please click 🔑 Similar Sighting to set your API key");
  }

  if (!modelConfig.selectedModel) {
    throw new Error("Please click 🔑 Similar Sighting to select a model");
  }

  const clipboardSource = String(clipboardText || "").trim();
  if (clipboardSource) {
    const extractedFromClipboard = await extractKeywordsByModel(
      clipboardSource,
      settings.keywordCount,
      modelConfig.selectedApiKey,
      modelConfig.selectedModel
    );

    const conciseSummary = await summarizeContentByModel({
      title: "Clipboard Content",
      url: "clipboard://",
      text: clipboardSource,
      apiKey: modelConfig.selectedApiKey,
      model: modelConfig.selectedModel,
      language
    });

    return {
      url: "clipboard://",
      title: "Clipboard Content",
      extractedKeywords: extractedFromClipboard,
      conciseSummary,
      settings,
      extractionSource: "clipboard-model",
      selectedModel: modelConfig.selectedModel || DEFAULTS.selectedModel
    };
  }

  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    throw new Error("Cannot find the active tab");
  }

  if (!isHsdUrl(tab.url)) {
    throw new Error("Current tab is not an HSD page (must contain hsdes.intel.com)");
  }

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (keywordCountInPage) => {
      const title = document.title || "";
      const h1Text = Array.from(document.querySelectorAll("h1, h2"))
        .map((n) => (n.textContent || "").trim())
        .filter(Boolean)
        .slice(0, 5)
        .join(" ");

      const mainText = (document.body?.innerText || "").slice(0, 20000);
      return {
        url: window.location.href,
        title,
        rawText: `${title} ${h1Text} ${mainText}`,
        keywordCount: keywordCountInPage
      };
    },
    args: [settings.keywordCount]
  });

  const extracted = await extractKeywordsByModel(
    result?.rawText || "",
    settings.keywordCount,
    modelConfig.selectedApiKey,
    modelConfig.selectedModel
  );

  return {
    url: result?.url || tab.url,
    title: result?.title || tab.title || "",
    extractedKeywords: extracted,
    settings,
    extractionSource: "model",
    selectedModel: modelConfig.selectedModel || DEFAULTS.selectedModel
  };
}

async function openHsdArticlePage(url) {
  const targetUrl = String(url || "").trim();
  if (!targetUrl) {
    throw new Error("Missing target URL");
  }

  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    throw new Error("Cannot find the active tab");
  }

  await chrome.tabs.update(tab.id, { url: targetUrl });
  return { ok: true, url: targetUrl };
}

async function searchSimilarSightingOnPage(keywords) {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    throw new Error("Cannot find the active tab");
  }

  if (!isHsdUrl(tab.url)) {
    throw new Error("Current tab is not an HSD page (must contain hsdes.intel.com)");
  }

  const cleaned = Array.isArray(keywords)
    ? keywords.map(normalizeKeyword).filter(Boolean)
    : [];

  if (!cleaned.length) {
    throw new Error("Please provide at least 1 keyword");
  }

  const query = cleaned.join(" ");

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (queryInPage) => {
      const input = Array.from(document.querySelectorAll("input[type='text'], input"))
        .find((el) => (el.getAttribute("placeholder") || "").trim() === "Search HSD-ES by id or title");

      if (!input) {
        return { ok: false, error: "找不到 HSD 搜尋欄位（placeholder: Search HSD-ES by id or title）" };
      }

      const isPopupVisible = () => {
        const popups = Array.from(document.querySelectorAll("div.popup-element"));
        return popups.some((popup) => {
          const style = window.getComputedStyle(popup);
          return style.display !== "none" && style.visibility !== "hidden" && popup.getBoundingClientRect().height > 0;
        });
      };

      const clickInputToOpenPopup = () => {
        input.focus();
        input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        input.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      };

      if (!isPopupVisible()) {
        clickInputToOpenPopup();
        await new Promise((resolve) => setTimeout(resolve, 120));
      }

      if (!isPopupVisible()) {
        clickInputToOpenPopup();
        await new Promise((resolve) => setTimeout(resolve, 120));
      }

      input.focus();
      input.value = queryInPage;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));

      const enterDown = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        which: 13,
        keyCode: 13,
        bubbles: true
      });
      const enterUp = new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
        which: 13,
        keyCode: 13,
        bubbles: true
      });

      input.dispatchEvent(enterDown);
      input.dispatchEvent(enterUp);

      return { ok: true };
    },
    args: [query]
  });

  if (!result?.ok) {
    throw new Error(result?.error || "搜尋觸發失敗");
  }

  return { ok: true, query };
}

async function getTopSightingLinksFromActivePage() {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    throw new Error("Cannot find the active tab");
  }

  if (!isHsdUrl(tab.url)) {
    throw new Error("Current tab is not an HSD page (must contain hsdes.intel.com)");
  }

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const resultView = document.querySelector("div.result-view");
      if (!resultView) {
        return [];
      }

      const options = Array.from(resultView.querySelectorAll("mat-option.mat-option-result"));
      const candidates = [];

      for (const option of options) {
        const articleLink = option.querySelector("a[target='_blank'][href*='/article/']");
        if (!articleLink) continue;

        const hrefRaw = articleLink.getAttribute("href") || "";
        let href = "";
        try {
          href = new URL(hrefRaw, window.location.href).href;
        } catch (_err) {
          href = "";
        }
        if (!href) continue;

        const titleNode = option.querySelector("a.result-option-txt-bold");
        const text = (titleNode?.textContent || "").trim() || (articleLink.textContent || "").trim();
        candidates.push({ href, text });
      }

      const unique = [];
      const seen = new Set();
      for (const item of candidates) {
        const articleIdMatch = item.href.match(/\/article\/(\d+)/i);
        const key = articleIdMatch ? `article-${articleIdMatch[1]}` : item.href;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(item);
      }

      return unique;
    }
  });

  const links = Array.isArray(result) ? result : [];
  if (!links.length) {
    throw new Error("No search result links found. Please confirm results are displayed on screen.");
  }

  return links;
}

function waitForTabComplete(tabId, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    let done = false;

    const timeoutId = setTimeout(() => {
      if (done) return;
      done = true;
      chrome.tabs.onUpdated.removeListener(onUpdated);
      reject(new Error("New tab load timed out"));
    }, timeoutMs);

    function onUpdated(updatedTabId, changeInfo) {
      if (done) return;
      if (updatedTabId !== tabId) return;
      if (changeInfo.status !== "complete") return;

      done = true;
      clearTimeout(timeoutId);
      chrome.tabs.onUpdated.removeListener(onUpdated);
      resolve();
    }

    chrome.tabs.onUpdated.addListener(onUpdated);
  });
}

async function waitForPageContentReady(tabId, timeoutMs = 12000) {
  const start = Date.now();
  let lastLength = 0;
  let stableRounds = 0;

  while (Date.now() - start < timeoutMs) {
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const bodyText = document.body?.innerText || "";
          const textLength = bodyText.trim().length;
          const hasLoadingWord = /loading|載入中|加载中/i.test(bodyText);
          const hasBusyIndicator = !!document.querySelector(
            ".loading, .spinner, mat-progress-bar, mat-spinner, [aria-busy='true']"
          );
          return {
            readyState: document.readyState,
            textLength,
            hasLoadingWord,
            hasBusyIndicator
          };
        }
      });

      const pageStable = result?.textLength > 300 && result?.textLength === lastLength;
      if (pageStable) {
        stableRounds += 1;
      } else {
        stableRounds = 0;
      }
      lastLength = result?.textLength || 0;

      const noBusy = !result?.hasLoadingWord && !result?.hasBusyIndicator;
      if (result?.readyState === "complete" && noBusy && stableRounds >= 2) {
        return;
      }
    } catch (_err) {
      // executeScript may fail transiently under high concurrency — skip and retry
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function openTabAndCaptureContent(url) {
  const newTab = await chrome.tabs.create({ url, active: false });
  if (!newTab?.id) {
    throw new Error("Failed to create new tab");
  }

  await waitForTabComplete(newTab.id);
  await waitForPageContentReady(newTab.id);

  // Poll until the submitted date datepicker input has a value (Angular loads it async)
  // Wrapped in try/catch so any scripting error here does not abort the whole capture
  try {
    const deadline = Date.now() + 8000;
    while (Date.now() < deadline) {
      const [{ result: hasDate }] = await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        func: () => {
          const inp = document.querySelector("input[data-placeholder='submitted date']");
          return !!(inp && inp.value && inp.value.trim());
        }
      });
      if (hasDate) break;
      await new Promise((r) => setTimeout(r, 400));
    }
  } catch (_pollErr) {
    // Polling failed (e.g. CSP / frame detach) — proceed without waiting
  }

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: newTab.id },
    func: () => {
      const title = document.title || "";
      const url = window.location.href || "";
      const text = (document.body?.innerText || "").slice(0, 20000);

      // Method 1: direct data-placeholder selector
      let submittedDate = "";
      const dateInput = document.querySelector("input[data-placeholder='submitted date']");
      if (dateInput && dateInput.value) {
        submittedDate = dateInput.value.trim();
      }

      // Method 2: any mat-form-field whose label contains "submitted"
      if (!submittedDate) {
        for (const field of document.querySelectorAll("mat-form-field")) {
          const label = field.querySelector("mat-label, label, .mat-form-field-label span");
          if (label && /submitted/i.test(label.textContent || "")) {
            const inp = field.querySelector("input");
            if (inp && inp.value) { submittedDate = inp.value.trim(); break; }
          }
        }
      }

      // Method 3: any datepicker input with a value (aria-haspopup="dialog")
      if (!submittedDate) {
        for (const inp of document.querySelectorAll("input[aria-haspopup='dialog']")) {
          if (inp.value) { submittedDate = inp.value.trim(); break; }
        }
      }

      // Method 4: scan innerText for submitted_date label -> next date-like line
      if (!submittedDate) {
        const lines = text.split(/\n/);
        for (let i = 0; i < lines.length; i++) {
          if (/^\s*submitted_date\s*$/i.test(lines[i])) {
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
              const val = lines[j].trim();
              if (val && /\d{4}/.test(val)) { submittedDate = val; break; }
            }
            break;
          }
        }
      }

      // Method 5: regex over full innerText
      if (!submittedDate) {
        const m = text.match(/submitted_date\s*[:\s]+(\d{4}[-\/]\d{2}[-\/]\d{2}|\d{4}[-\/]\d{2}|\d{4})/i);
        if (m) submittedDate = m[1];
      }

      return { title, url, text, submittedDate };
    }
  });

  return {
    title: result?.title || "",
    url: result?.url || url,
    text: result?.text || "",
    submittedDate: result?.submittedDate || ""
  };
}

async function summarizeTop5Results(language, offset = 0) {
  const modelConfig = await getModelConfig();

  if (!isValidApiKey(modelConfig.selectedApiKey)) {
    throw new Error("Please click 🔑 Similar Sighting to set your API key");
  }
  if (!modelConfig.selectedModel) {
    throw new Error("Please click 🔑 Similar Sighting to select a model");
  }

  const links = await getTopSightingLinksFromActivePage();
  const batch = links.slice(offset, offset + COMPARE_BATCH_SIZE);

  const activeTab = await getActiveTab();
  const [{ result: originalContent }] = await chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: () => {
      return {
        title: document.title || "",
        url: window.location.href || "",
        text: (document.body?.innerText || "").slice(0, 20000)
      };
    }
  });

  const total = batch.length;
  const results = new Array(total).fill(null);

  await Promise.allSettled(
    batch.map(async (item, i) => {
      let result;
      try {
        const content = await openTabAndCaptureContent(item.href);
        const summary = await summarizeComparedToOriginal({
          original: originalContent,
          target: content,
          apiKey: modelConfig.selectedApiKey,
          model: modelConfig.selectedModel,
          language
        });
        result = {
          title: content.title || item.text || item.href,
          url: content.url || item.href,
          summary,
          submittedDate: content.submittedDate || ""
        };
      } catch (err) {
        result = {
          title: "(Summary failed)",
          url: item.href,
          summary: err?.message || String(err),
          submittedDate: ""
        };
      }
      results[i] = result;
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.SUMMARIZE_ITEM_PROGRESS,
        phase: "item",
        item: result,
        itemIndex: i,
        offset
      }).catch(() => {});
    })
  );

  return results.filter(Boolean);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      if (message?.type === MESSAGE_TYPES.GET_SETTINGS) {
        const settings = await getSettings();
        sendResponse({ ok: true, settings });
        return;
      }

      if (message?.type === MESSAGE_TYPES.SAVE_SETTINGS) {
        const settings = await saveSettings(message.settings || {});
        sendResponse({ ok: true, settings });
        return;
      }

      if (message?.type === MESSAGE_TYPES.GET_ACTIVE_HSD_PAGE) {
        const payload = await getActiveHsdPage({
          clipboardText: message.clipboardText || "",
          language: message.language || "zh-TW"
        });
        sendResponse({ ok: true, payload });
        return;
      }

      if (message?.type === MESSAGE_TYPES.OPEN_HSD_ARTICLE_PAGE) {
        const result = await openHsdArticlePage(message.url);
        sendResponse({ ok: true, result });
        return;
      }

      if (message?.type === MESSAGE_TYPES.GET_MODEL_CONFIG) {
        const config = await getModelConfig();
        sendResponse({ ok: true, config });
        return;
      }

      if (message?.type === MESSAGE_TYPES.SAVE_MODEL_CONFIG) {
        const config = await saveModelConfig(message.config || {});
        sendResponse({ ok: true, config });
        return;
      }

      if (message?.type === MESSAGE_TYPES.GET_MODELS) {
        const apiKey = String(message?.apiKey || "").trim();
        assertApiKey(apiKey);
        const openaiModels = await fetchModels(apiKey);

        let anthropicModels = [];
        try {
          anthropicModels = await fetchAnthropicModels(apiKey);
        } catch (_err) {
          anthropicModels = [];
        }

        const merged = [...new Set([...openaiModels, ...anthropicModels])];
        let modelCostCap = {};
        try {
          if (!isGnaiKey(apiKey)) {
            const quota = await fetchQuota(apiKey);
            modelCostCap = mapModelCostCapFromQuota(quota);
          }
        } catch (_err) {
          modelCostCap = {};
        }

        sendResponse({ ok: true, models: merged, modelCostCap });
        return;
      }

      if (message?.type === MESSAGE_TYPES.SEARCH_SIMILAR_SIGHTING) {
        const result = await searchSimilarSightingOnPage(message.keywords || []);
        sendResponse({ ok: true, result });
        return;
      }

      if (message?.type === MESSAGE_TYPES.SUMMARIZE_TOP5_RESULTS) {
        const items = await summarizeTop5Results(message.language || "zh-TW", message.offset || 0);
        sendResponse({ ok: true, items });
        return;
      }

      if (message?.type === MESSAGE_TYPES.CLOSE_FILTERED_TABS) {
        const keepUrls = new Set(Array.isArray(message.keepUrls) ? message.keepUrls : []);
        const closeUrls = new Set(Array.isArray(message.closeUrls) ? message.closeUrls : []);
        const allTabs = await chrome.tabs.query({});
        const toClose = allTabs
          .filter((tab) => {
            const tabUrl = tab.url || "";
            // Never close the current side panel's tab or any tab not matching a sighting URL
            const matchesClose = [...closeUrls].some((u) => u && tabUrl.includes(u));
            const matchesKeep = [...keepUrls].some((u) => u && tabUrl.includes(u));
            return matchesClose && !matchesKeep;
          })
          .map((tab) => tab.id);
        if (toClose.length) {
          await chrome.tabs.remove(toClose);
        }
        sendResponse({ ok: true, closed: toClose.length });
        return;
      }

      if (message?.type === MESSAGE_TYPES.RETRY_SINGLE_ITEM) {
        const modelConfig = await getModelConfig();
        if (!isValidApiKey(modelConfig.selectedApiKey)) {
          sendResponse({ ok: false, error: "Please set your API key" });
          return;
        }
        const activeTab = await getActiveTab();
        const [{ result: originalContent }] = await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => ({
            title: document.title || "",
            url: window.location.href || "",
            text: (document.body?.innerText || "").slice(0, 20000)
          })
        });
        const content = await openTabAndCaptureContent(message.url);
        const summary = await summarizeComparedToOriginal({
          original: originalContent,
          target: content,
          apiKey: modelConfig.selectedApiKey,
          model: modelConfig.selectedModel,
          language: message.language || "zh-TW"
        });
        sendResponse({
          ok: true,
          item: {
            title: content.title || message.url,
            url: content.url || message.url,
            summary,
            submittedDate: content.submittedDate || ""
          }
        });
        return;
      }

      sendResponse({ ok: false, error: `不支援的 message type: ${String(message?.type || "")}` });
    } catch (err) {
      sendResponse({ ok: false, error: err?.message || String(err) });
    }
  })();

  return true;
});
