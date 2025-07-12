chrome.action.onClicked.addListener((tab) => {
  if (tab.url) {
    chrome.storage.local.get({ savedLinks: [] }, (data) => {
      const updatedLinks = [...data.savedLinks, tab.url];
      chrome.storage.local.set({ savedLinks: updatedLinks });
      console.log("Saved page URL:", tab.url);
    });
  }
});
