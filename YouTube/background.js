const BASE_URL = "https://www.youtube.com/";
let appTabID = null;

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
    if (tab.url && tab.url.startsWith(BASE_URL)) {
        if (appTabID && appTabID !== tabID) {
            chrome.tabs
                .remove(tabID)
                .catch((error) => console.log("Tab already closed:", error));
            chrome.tabs
                .update(appTabID, { active: true })
                .catch((error) => console.log("Error focusing tab:", error));
        } else {
            appTabID = tabID;
        }
    } else if (tabID === appTabID) {
        appTabID = null;
    }
});

chrome.tabs.onRemoved.addListener((tabID) => {
    if (tabID === appTabID) {
        appTabID = null;
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    if (tab.pendingUrl && tab.pendingUrl.startsWith(BASE_URL)) {
        handleNewTab(tab.id);
    }
});

chrome.action.onClicked.addListener(() => {
    if (appTabID) {
        chrome.tabs.update(appTabID, { active: true }).catch(() => {
            chrome.tabs.create({ url: BASE_URL });
        });
    } else {
        chrome.tabs.create({ url: BASE_URL });
    }
});

function handleNewTab(newTabID) {
    if (appTabID) {
        chrome.tabs
            .update(appTabID, { active: true })
            .catch((error) => console.log("Error focusing tab:", error));
        chrome.tabs
            .remove(newTabID)
            .catch((error) => console.log("Tab already closed:", error));
    } else {
        appTabID = newTabID;
    }
}

chrome.tabs.query({ url: BASE_URL }, (tabs) => {
    if (tabs.length > 0) {
        appTabID = tabs[0].id;
    }
});
