// Load and apply rules when the page loads
chrome.storage.sync.get(['sites'], (result) => {
  const sites = result.sites || [];
  const currentUrl = window.location.href;

  // Find matching site configuration
  const siteConfig = sites.find(site => 
    currentUrl.includes(site.url) && site.enabled
  );

  if (siteConfig) {
    // Apply each XPath rule
    siteConfig.rules.forEach(xpathRule => {
      if (xpathRule) {
        try {
          const elements = document.evaluate(
            xpathRule,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
          );

          // Remove matched elements
          for (let i = 0; i < elements.snapshotLength; i++) {
            const element = elements.snapshotItem(i);
            if (element && element.parentNode) {
              element.parentNode.removeChild(element);
            }
          }
        } catch (error) {
          console.error(`Error applying XPath rule: ${xpathRule}`, error);
        }
      }
    });

    // Special handling for x.com - expand center content to full width
    if (siteConfig.expandFullWidth && currentUrl.includes('x.com')) {
      // Inject styles to hide sidebars and expand main content
      const styleId = 'x-com-full-width-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          /* Hide left sidebar - navigation menu */
          [data-testid="sidebar"],
          nav[aria-label="Timeline: Timeline with posts"],
          header ~ div:first-child {
            display: none !important;
          }
          /* Hide right sidebar column */
          [data-testid="sidebarColumn"],
          aside[aria-label="Timeline: Trending now"],
          header ~ div:last-child {
            display: none !important;
          }
          /* Expand main content area to full width */
          main[role="main"] {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Ensure the primary column takes full width */
          [data-testid="primaryColumn"] {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          /* Remove any max-width constraints on timeline */
          [data-testid="primaryColumn"] [aria-label="Timeline"] {
            max-width: 100% !important;
          }
          /* Hide any other sidebars with complementary role */
          aside[role="complementary"] {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Create a MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      siteConfig.rules.forEach(xpathRule => {
        if (xpathRule) {
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
        }
      });

      // Re-apply full width styles for dynamically added content on x.com
      if (siteConfig.expandFullWidth && currentUrl.includes('x.com')) {
        const styleId = 'x-com-full-width-style';
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            /* Hide left sidebar - navigation menu */
            [data-testid="sidebar"],
            nav[aria-label="Timeline: Timeline with posts"],
            header ~ div:first-child {
              display: none !important;
            }
            /* Hide right sidebar column */
            [data-testid="sidebarColumn"],
            aside[aria-label="Timeline: Trending now"],
            header ~ div:last-child {
              display: none !important;
            }
            /* Expand main content area to full width */
            main[role="main"] {
              max-width: 100% !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            /* Ensure the primary column takes full width */
            [data-testid="primaryColumn"] {
              max-width: 100% !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            /* Remove any max-width constraints on timeline */
            [data-testid="primaryColumn"] [aria-label="Timeline"] {
              max-width: 100% !important;
            }
            /* Hide any other sidebars with complementary role */
            aside[role="complementary"] {
              display: none !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});
