document.addEventListener('DOMContentLoaded', () => {
  let sites = [];

  // Export configuration
  document.getElementById('export-config').addEventListener('click', () => {
    const config = { sites };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-clean-config.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import configuration
  document.getElementById('import-config').addEventListener('click', () => {
    document.getElementById('import-input').click();
  });

  document.getElementById('import-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          if (config.sites && Array.isArray(config.sites)) {
            sites = config.sites;
            chrome.storage.sync.set({ sites }, () => {
              renderSites();
              event.target.value = '';
            });
          }
        } catch (error) {
          console.error('Invalid configuration file:', error);
        }
      };
      reader.readAsText(file);
    }
  });


  // Load saved sites
  chrome.storage.sync.get(['sites'], (result) => {
    sites = result.sites || [];
    renderSites();
  });

  // Add new site
  document.getElementById('add-site').addEventListener('click', () => {
    const urlInput = document.getElementById('site-url');
    const url = urlInput.value.trim();
    
    if (url) {
      sites.push({
        url: url,
        enabled: true,
        rules: []
      });
      
      chrome.storage.sync.set({ sites }, () => {
        urlInput.value = '';
        renderSites();
      });
    }
  });

  function renderSites() {
    const sitesList = document.getElementById('sites-list');
    sitesList.innerHTML = '';

    sites.forEach((site, siteIndex) => {
      const siteDiv = document.createElement('div');
      siteDiv.className = 'site-rules';

      // Site header with toggle and delete
      const header = document.createElement('div');
      header.className = 'rule-item';
      
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = site.enabled;
      toggle.addEventListener('change', () => {
        sites[siteIndex].enabled = toggle.checked;
        chrome.storage.sync.set({ sites });
      });

      const urlSpan = document.createElement('span');
      urlSpan.textContent = site.url;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        sites.splice(siteIndex, 1);
        chrome.storage.sync.set({ sites }, renderSites);
      });

      header.appendChild(toggle);
      header.appendChild(urlSpan);
      header.appendChild(deleteBtn);
      siteDiv.appendChild(header);

      // XPath rules
      site.rules.forEach((rule, ruleIndex) => {
        const ruleDiv = document.createElement('div');
        ruleDiv.className = 'rule-item';

        const xpathInput = document.createElement('input');
        xpathInput.type = 'text';
        xpathInput.value = rule;
        xpathInput.addEventListener('change', () => {
          sites[siteIndex].rules[ruleIndex] = xpathInput.value;
          chrome.storage.sync.set({ sites });
        });

        const deleteRuleBtn = document.createElement('button');
        deleteRuleBtn.className = 'delete-btn';
        deleteRuleBtn.textContent = 'X';
        deleteRuleBtn.addEventListener('click', () => {
          sites[siteIndex].rules.splice(ruleIndex, 1);
          chrome.storage.sync.set({ sites }, renderSites);
        });

        ruleDiv.appendChild(xpathInput);
        ruleDiv.appendChild(deleteRuleBtn);
        siteDiv.appendChild(ruleDiv);
      });

      // Add new rule button
      const addRuleBtn = document.createElement('button');
      addRuleBtn.textContent = 'Add XPath Rule';
      addRuleBtn.addEventListener('click', () => {
        sites[siteIndex].rules.push('');
        chrome.storage.sync.set({ sites }, renderSites);
      });

      siteDiv.appendChild(addRuleBtn);
      sitesList.appendChild(siteDiv);
    });
  }
});