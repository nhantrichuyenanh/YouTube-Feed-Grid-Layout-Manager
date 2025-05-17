(function() {
  let settings = {
    gridColumns: 4
  };
 
  browser.storage.local.get({
    gridColumns: 4
  }).then((result) => {
    settings = result;
    applySettings();
  });
  
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "updateGridColumns") {
      settings.gridColumns = message.value;
      applySettings();
    }
    return Promise.resolve();
  });
 
  function applySettings() {
    document.body.classList.add('yt-grid-active');
    applyGridLayout(settings.gridColumns);
    fixScrollbarGap();
    setupMutationObserver();
  }
 
  function applyGridLayout(columns) {
    document.body.classList.remove(
      'yt-grid-columns-2',
      'yt-grid-columns-3',
      'yt-grid-columns-4',
      'yt-grid-columns-5',
      'yt-grid-columns-6'
    );
   
    document.body.classList.add(`yt-grid-columns-${columns}`);
  }
  
  function fixScrollbarGap() {
    const styleElement = document.getElementById('yt-grid-style') || document.createElement('style');
    if (!styleElement.id) {
      styleElement.id = 'yt-grid-style';
      document.head.appendChild(styleElement);
    }
   
    styleElement.textContent = `
      /* Fix for the gap between videos and scrollbar */
      ytd-rich-grid-renderer {
        --ytd-rich-grid-items-per-row: ${settings.gridColumns} !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      
      ytd-rich-grid-row {
        margin-right: 0 !important;
      }
      
      #contents.ytd-rich-grid-renderer {
        padding-right: 8px !important;
        padding-left: 8px !important;
      }
    `;
  }
 
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          applyGridLayout(settings.gridColumns);
          fixScrollbarGap();
        }
      });
    });
   
    observer.observe(document.body, { childList: true, subtree: true });
  }
 
  applySettings();
})();