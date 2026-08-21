# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Website Clean is a Chrome Extension (Manifest V3) written in vanilla JavaScript that uses XPath expressions to find and remove unwanted elements (such as ads, sidebars, and banners) from web pages. It also includes site-specific customizations such as full-width mode for x.com.

## Architecture

The extension consists of standard Chrome Extension components with no build step:

- [manifest.json](manifest.json): Extension configuration declaring Manifest V3, permissions (`storage`, `activeTab`, `scripting`), content scripts injected on `<all_urls>`, popup UI, and background service worker.
- [content.js](content.js): Content script injected into every web page. Reads site configurations from `chrome.storage.sync`, matches against the current URL (`url.includes(site.url)`), evaluates XPath rules using `document.evaluate` (`UNORDERED_NODE_SNAPSHOT_TYPE`), removes matched DOM nodes, and monitors for dynamic content updates via `MutationObserver`. Handles site-specific features (e.g., style injection for `expandFullWidth` on x.com).
- [popup.html](popup.html) & [popup.js](popup.js): Extension toolbar popup UI allowing users to add/delete sites, toggle site status, manage XPath rules, toggle site-specific features (e.g. x.com full-width mode), and import/export configurations as JSON files.
- [background.js](background.js): Minimal background service worker initializing storage state on extension install.

## Configuration Schema

Configurations are stored in `chrome.storage.sync` under the `sites` key and can be imported/exported as JSON:

```json
{
  "sites": [
    {
      "url": "https://www.example.com",
      "enabled": true,
      "rules": [
        "//div[@class=\"unwanted-element\"]"
      ],
      "expandFullWidth": false
    }
  ]
}
```

## Development & Testing Workflow

There is no package manager, compiler, linter, or bundler configured in this repository.

### Loading the Extension in Chrome
1. Navigate to `chrome://extensions/`
2. Enable **Developer mode** in the top right
3. Click **Load unpacked** and select the repository root directory
4. After making changes to files:
   - For [content.js](content.js), [background.js](background.js), or [manifest.json](manifest.json): Click the refresh/reload icon on the extension card in `chrome://extensions/` and reload target web pages.
   - For [popup.html](popup.html) or [popup.js](popup.js): Reopen the popup to see changes.
