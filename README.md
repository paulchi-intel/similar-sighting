# Similar Sighting

A Chrome extension that intelligently discovers related issues in Intel's Hardware and Software Diagnostic (HSD) system. Extract key insights from HSD pages and leverage AI-powered analysis to find similar sightings in HSD-ES.

## Features

🔍 **Intelligent Keyword Extraction**
- Automatically extract keywords from HSD pages using AI models
- Customizable keyword count and refinement
- Manual keyword editing and management

🔎 **Smart Search**
- Query HSD-ES with extracted or custom keywords
- Multi-language support (Traditional Chinese, Simplified Chinese, English)
- Batch processing of search results

📊 **Advanced Filtering & Comparison**
- Filter results by similarity score, platform, and year
- Compare top results side-by-side
- Generate organized reports with insights

📋 **Flexible Input**
- Load HSD pages directly via the extension
- Paste content from clipboard
- Process any text for keyword extraction

🔐 **Dual API Key Support**
- Supports both **ExpertGPT** (`pak_...`) and **GNAI** API keys
- Model list and API endpoints are automatically routed based on key type
- ExpertGPT: models fetched dynamically from API with per-model quota display
- GNAI: fixed model list with no quota display; supports both OpenAI and Anthropic models

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the project directory
5. The "Similar Sighting" extension will appear in your Chrome toolbar

## Getting API Keys

Two API key types are supported:

| Type | Format | How to get it |
|------|--------|---------------|
| **ExpertGPT** | starts with `pak_` | https://expertgpt.intel.com/my_profile |
| **GNAI** | any other string | https://gnai.intel.com/auth/oauth2/sso/ |

## Getting Started

### Initial Setup

1. **Install the extension** (see Installation section above)
2. **Configure API Key:**
   - Click **🔑 Similar Sighting** in the side panel header
   - Enter your ExpertGPT (`pak_...`) or GNAI API key
   - The model list loads automatically based on your key type
   - Select your preferred AI model
   - Click "Confirm"

### Basic Usage

**Method 1: Load from HSD Page**
1. Navigate to any HSD article page
2. Click the "Similar Sighting" extension icon
3. Click "Load HSD" in the side panel
4. Review extracted keywords and adjust if needed
5. Click "Search Similar Sighting"
6. Browse results in HSD-ES

**Method 2: Load from Clipboard**
1. Copy your query text to clipboard
2. Click the "Similar Sighting" extension icon
3. Click "Load Clipboard"
4. Follow steps 4-6 above

### Advanced Features

**Compare Results:**
- Click "Compare Top 5" to analyze the top 5 search results
- Use "Compare Next 5" to view additional comparisons
- View side-by-side analysis with key differences

**Filter Results:**
- Set minimum similarity threshold
- Filter by platform keywords
- Filter by year published
- Click "Apply Filter" to update results

**Generate Report:**
- Click "Generate Report" after filtering
- Copy the formatted results to clipboard
- Share findings with your team

## Configuration

### Settings

Access settings via **🔑 Similar Sighting** in the side panel header:

- **API Key:** ExpertGPT (`pak_...`) or GNAI key
- **Model Selection:** Choose from available AI models for keyword extraction
  - ExpertGPT key: models loaded from API, quota shown as `(used/limit)`
  - GNAI key: fixed list of OpenAI and Anthropic models, no quota shown

Options page (⚙️ icon in Chrome Extensions):

- **Keyword Count:** Set number of keywords to extract (default: 3)

## How API Key Routing Works

| Key type | Model type | Endpoint used |
|----------|------------|---------------|
| ExpertGPT (`pak_...`) | OpenAI models | `https://expertgpt.intel.com/v1/chat/completions` |
| ExpertGPT (`pak_...`) | Anthropic models | `https://expertgpt.intel.com/anthropic/v1/messages` |
| GNAI | OpenAI models | `https://gnai.intel.com/api/providers/openai/v1/chat/completions` |
| GNAI | Anthropic models | `https://gnai.intel.com/api/providers/anthropic/v1/messages` |

GNAI fixed model list:
- **OpenAI:** `gpt-4o`, `gpt-4.1`, `gpt-5-mini`, `gpt-5-nano`, `o3-mini`
- **Anthropic:** `claude-4-6-opus`, `claude-4-6-sonnet`, `claude-4-5-opus`, `claude-4-5-sonnet`, `claude-4-5-haiku`

## File Structure

```
similar-sighting/
├── manifest.json          # Extension configuration
├── background.js          # Service worker & messaging logic
├── sidepanel.html         # Main UI
├── sidepanel.js           # UI logic & interactions
├── options.html           # Settings page (keyword count)
└── README.md              # This file
```

## Supported Languages

- 繁體中文 (Traditional Chinese)
- 简体中文 (Simplified Chinese)
- English

## Permissions

The extension requires the following Chrome permissions:

- `tabs` - Access to current tab information
- `activeTab` - Interact with the active tab
- `scripting` - Execute scripts on HSD pages
- `storage` - Store settings locally
- `sidePanel` - Display the side panel UI
- `clipboardRead` - Read clipboard content

Host permissions for:
- `https://hsdes.intel.com/*` - Intel HSD system
- `https://*.hsdes.intel.com/*` - HSD subdomains
- `https://expertgpt.intel.com/*` - ExpertGPT AI endpoint
- `https://gnai.intel.com/*` - GNAI AI endpoint

## Troubleshooting

### Extension not showing results
- Verify you're on an HSD page or have valid clipboard content
- Check that API key is configured (click 🔑 Similar Sighting)
- Ensure the selected model is appropriate for your key type

### "Search failed" or API error
- Confirm your API key is valid and active
- Check network connectivity
- For ExpertGPT keys: verify the key starts with `pak_` and the selected model is available
- For GNAI keys: verify the key is correct and `gnai.intel.com` is reachable

### Keywords not extracted
- Ensure at least 1 keyword is configured in options
- Try switching to a different AI model
- Check that the HSD page is fully loaded before extracting

## Changelog

### v1.1.0
- Added GNAI API key support alongside existing ExpertGPT keys
- Automatic endpoint routing based on key type (ExpertGPT vs GNAI)
- Anthropic models now correctly routed to Anthropic-format endpoint for both key types
- Model selector hides quota for GNAI keys (quota not applicable)
- Added `https://gnai.intel.com/*` to host permissions

### v1.0.0
- Initial release
- Keyword extraction from HSD pages
- Similar sighting search in HSD-ES
- Multi-language support
- Advanced filtering and comparison features
- Report generation

## License

**This software is provided for Intel internal use only.** Unauthorized access, distribution, or use is prohibited.

## Support

For issues, questions, or feature requests, please contact your IT department or the development team.

---

**Note:** This extension is designed for Intel employees and requires valid ExpertGPT or GNAI credentials to function.
