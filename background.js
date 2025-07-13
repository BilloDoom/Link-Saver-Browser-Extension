chrome.action.onClicked.addListener((tab) => {
    if (!tab.url) return;

    chrome.storage.local.get({ savedLinks: [] }, (data) => {
        const savedLinks = data.savedLinks;
        if (!savedLinks.includes(tab.url)) {
            savedLinks.push(tab.url);
            chrome.storage.local.set({ savedLinks });
            console.log("Saved new URL:", tab.url);
        } else {
            console.log("URL already saved:", tab.url);
        }
    });
});
