// Load and apply rules when the page loads
const X_COM_FULL_WIDTH_STYLE_ID = 'x-com-full-width-style';

function normalizeMaxWidth(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '100%';
    // Bare number with no unit: treat as px (so "1500" -> "1500px")
    if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
    // Anything else (1500px, 100%, 90vw, none...) is passed through
    return trimmed;
  }
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return `${value}px`;
  return '100%';
}

// Build the CSS used to (a) hide x.com sidebars and (b) stretch the center
// tweet column. `tweetMaxWidth` is the cap applied to the inner wrapper that
// x.com limits to ~600px; default 100% (fill the available space).
function getXComFullWidthCss(tweetMaxWidth) {
  const maxWidth = normalizeMaxWidth(tweetMaxWidth);
  return `
    /* Hide left navigation and right trending/search sidebars */
    [data-testid="sidebar"],
    nav[aria-label="Timeline: Timeline with posts"],
    [data-testid="sidebarColumn"],
    aside[aria-label="Timeline: Trending now"],
    aside[role="complementary"],
    header ~ div:first-child,
    header ~ div:last-child {
      display: none !important;
    }
    /* Expand the main element to fill the page */
    main[role="main"] {
      max-width: 100% !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    /* Primary (center) column takes the full available width */
    [data-testid="primaryColumn"] {
      max-width: 100% !important;
      width: 100% !important;
      margin: 0 auto !important;
      border: none !important;
    }
    /* Stretch the inner wrapper that constrains tweet width.
       The constrained element may sit at multiple depths inside
       primaryColumn, so we cover child / grandchild / great-grandchild.
       Auto horizontal margins center the block when it is narrower than
       the page (so the tweet area sits in the middle of the browser). */
    [data-testid="primaryColumn"] > div,
    [data-testid="primaryColumn"] > div > div,
    [data-testid="primaryColumn"] > div > div > div {
      max-width: ${maxWidth} !important;
      width: 100% !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    /* Timeline region inside the primary column uses full width */
    [data-testid="primaryColumn"] section[role="region"] {
      max-width: 100% !important;
      width: 100% !important;
    }
    /* Each tweet cell uses the full available width.
       Need both max-width AND width: x.com sets a hardcoded width on these
       (~600px) which would beat a lone max-width override. */
    [data-testid="cellInnerDiv"] {
      max-width: 100% !important;
      width: 100% !important;
    }
    /* Tweet article stretches to the wider container so text uses the room */
    article[data-testid="tweet"] {
      max-width: 100% !important;
      width: 100% !important;
    }
    /* Tweet media (images / videos / quoted tweets) also fills the row */
    [data-testid="tweetPhoto"] img,
    [data-testid="videoPlayer"] {
      max-width: 100% !important;
      width: 100% !important;
    }
  `;
}

// JavaScript fallback: scan primaryColumn descendants for any element whose
// computed max-width sits in the 500-1000px range (i.e. the kind of "row
// container" width x.com uses) and override it. This catches cases where the
// CSS selectors above miss the constrained wrapper because x.com moved it
// deeper in the tree.
//
// Only runs when the user has set a px value (e.g. "1500px"). For "100%" or
// other CSS values the stylesheet above already handles it.
function stretchXComTimelineJS(maxWidth) {
  try {
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
    if (!primaryColumn) return;

    // Run the user value through normalizeMaxWidth so "1500" (no unit) works
    // the same as "1500px", "100%", "90vw", etc.
    const normalized = normalizeMaxWidth(maxWidth);
    const match = String(normalized).match(/^(\d+(\.\d+)?)px$/);
    if (!match) return;
    const targetMaxWidth = parseFloat(match[1]);

    const candidates = primaryColumn.querySelectorAll('div, section');
    candidates.forEach(el => {
      const style = getComputedStyle(el);
      const mw = parseFloat(style.maxWidth);
      if (Number.isFinite(mw) && mw >= 500 && mw <= 1000) {
        el.style.setProperty('max-width', `${targetMaxWidth}px`, 'important');
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('margin-left', 'auto', 'important');
        el.style.setProperty('margin-right', 'auto', 'important');
        // Force un-float / static position so margin: auto actually centers
        el.style.setProperty('float', 'none', 'important');
        el.style.setProperty('position', 'relative', 'important');
      }
    });
  } catch (err) {
    console.error('Error stretching x.com timeline:', err);
  }
}

// Stretch the per-tweet cells and articles so they actually fill the
// 1500px column instead of staying at the ~470px x.com hardcoded width.
// x.com sets a literal `width: 600px` (not just max-width) on these, so a
// max-width: 100% override alone does nothing.
function stretchXComTweets() {
  try {
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
    if (!primaryColumn) return;

    primaryColumn.querySelectorAll('[data-testid="cellInnerDiv"]').forEach(el => {
      el.style.setProperty('max-width', '100%', 'important');
      el.style.setProperty('width', '100%', 'important');
    });

    primaryColumn.querySelectorAll('article[data-testid="tweet"]').forEach(el => {
      el.style.setProperty('max-width', '100%', 'important');
      el.style.setProperty('width', '100%', 'important');
    });
  } catch (err) {
    console.error('Error stretching x.com tweets:', err);
  }
}

function applyXComFullWidth(tweetMaxWidth) {
  // Inject / update the stylesheet
  const css = getXComFullWidthCss(tweetMaxWidth);
  let style = document.getElementById(X_COM_FULL_WIDTH_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = X_COM_FULL_WIDTH_STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== css) {
    style.textContent = css;
  }
  // JS fallback for cases where the CSS selectors miss the constrained wrapper
  stretchXComTimelineJS(tweetMaxWidth);
  // Also force per-tweet cells / articles to fill the wider column
  stretchXComTweets();
}

function removeXComFullWidth() {
  const style = document.getElementById(X_COM_FULL_WIDTH_STYLE_ID);
  if (style) style.remove();
  // Note: inline styles set by stretchXComTimelineJS will persist until the
  // page is reloaded. Reloading is the cleanest way to fully restore layout.
}

chrome.storage.sync.get(['sites'], (result) => {
  const sites = result.sites || [];
  const currentUrl = window.location.href;
  const siteConfig = sites.find(site => currentUrl.includes(site.url) && site.enabled);
  if (!siteConfig) return;

  const isXCom = currentUrl.includes('x.com');

  // Apply each XPath rule
  const applyRules = () => {
    siteConfig.rules.forEach(xpathRule => {
      if (!xpathRule) return;
      try {
        const elements = document.evaluate(
          xpathRule,
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        for (let i = 0; i < elements.snapshotLength; i++) {
          const element = elements.snapshotItem(i);
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      } catch (error) {
        console.error(`Error applying XPath rule: ${xpathRule}`, error);
      }
    });
  };

  applyRules();

  if (siteConfig.expandFullWidth && isXCom) {
    applyXComFullWidth(siteConfig.tweetMaxWidth);
  }

  // MutationObserver: handle dynamic content + re-apply full-width styles if
  // anything tries to remove the style tag.
  const observer = new MutationObserver(() => {
    applyRules();
    if (siteConfig.expandFullWidth && isXCom) {
      applyXComFullWidth(siteConfig.tweetMaxWidth);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // React to settings changes while the page is open so the user does not
  // have to reload to see the new width.
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'sync' || !changes.sites) return;
    const newSites = changes.sites.newValue || [];
    const newConfig = newSites.find(site => currentUrl.includes(site.url) && site.enabled);
    if (newConfig && newConfig.expandFullWidth && isXCom) {
      applyXComFullWidth(newConfig.tweetMaxWidth);
    } else {
      removeXComFullWidth();
    }
  });
});
