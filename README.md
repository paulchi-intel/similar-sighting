# Similar Sighting

A Chrome extension that intelligently discovers related issues in Intel's Hardware and Software Diagnostic (HSD) system. Extract key insights from HSD pages and leverage AI-powered analysis to find similar sightings in HSD-ES.

## Features

🔍 **Intelligent Keyword Extraction**
- Automatically extract keywords from HSD pages using AI models (Claude, etc.)
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

🔐 **Secure Configuration**
- Support for multiple AI models through ExpertGPT platform
- Configurable API key and model selection
- Persistent settings storage

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the project directory
5. The "Similar Sighting" extension will appear in your Chrome toolbar

## Getting Started

### Initial Setup

1. **Install the extension** (see Installation section above)
2. **Configure API Key:**
   - Click the extension icon → Settings (⚙️)
   - Enter your ExpertGPT API key (format: `pak_*`)
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

Access settings via the ⚙️ icon in the side panel:

- **API Key:** Your ExpertGPT platform API key (required)
- **Model Selection:** Choose from available AI models for keyword extraction
- **Keyword Count:** Set number of keywords to extract (default: 3)
- **Language:** Preferred UI language

## File Structure

```
similar-sighting/
├── manifest.json          # Extension configuration
├── background.js          # Service worker & messaging logic
├── sidepanel.html         # Main UI
├── sidepanel.js           # UI logic & interactions
├── options.html           # Settings page
└── README.md              # This file
```

## API Requirements

- **Platform:** Intel ExpertGPT (`https://expertgpt.intel.com/v1`)
- **Authentication:** API key with `pak_` prefix
- **Timeout:** 20 seconds per request
- **Rate Limit:** Batch processing up to 5 results per cycle

## Supported Languages

- 繁體中文 (Traditional Chinese)
- 简体中文 (Simplified Chinese)
- English

UI language automatically adjusts based on browser settings, with fallback to Traditional Chinese.

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
- `https://expertgpt.intel.com/*` - AI model endpoint

## Troubleshooting

### Extension not showing results
- Verify you're on an HSD page or have valid clipboard content
- Check that API key is configured correctly
- Ensure API key format is correct (starts with `pak_`)

### "Search failed" error
- Confirm your ExpertGPT API key is valid and active
- Check network connectivity
- Verify the selected model is available

### Keywords not extracted
- Ensure at least 1 keyword is configured in settings
- Try with different AI models
- Check HSD page is fully loaded before extracting

## Changelog

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

**Note:** This extension is designed for Intel employees and requires valid ExpertGPT credentials to function.
