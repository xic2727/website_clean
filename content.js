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
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});