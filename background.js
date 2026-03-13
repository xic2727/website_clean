// Background script is kept minimal since we're using chrome.storage.sync
// for data persistence and content scripts for DOM manipulation

chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with empty sites array if not exists
  chrome.storage.sync.get(['sites'], (result) => {
    if (!result.sites) {
      chrome.storage.sync.set({ sites: [] });
    }
  });
});