document.addEventListener('DOMContentLoaded', function() {
  const gridSelect = document.getElementById('gridSelect');
  
  // load saved settings
  browser.storage.local.get({
    gridColumns: 4
  }).then((result) => {
    gridSelect.value = result.gridColumns;
  });
  
  // save settings and update content when selection changes
  gridSelect.addEventListener('change', function() {
    const value = parseInt(this.value);
    
    // save to storage
    browser.storage.local.set({ gridColumns: value }).then(() => {
      // update all YouTube tabs
      updateAllTabs(value);
    });
  });
  
  // send update message to all YouTube tabs
  function updateAllTabs(columns) {
    browser.tabs.query({ url: "https://www.youtube.com/*" }).then((tabs) => {
      tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, {
          action: "updateGridColumns",
          value: columns
        }).catch(error => {
          // tab might not have loaded content script yet, which is fine
          console.log(`Could not update tab ${tab.id}: ${error.message}`);
        });
      });
    });
  }
});