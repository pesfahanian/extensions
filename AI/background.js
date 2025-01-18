const sitesTabs = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openSite") {
        handleSiteOpen(request.url);
    }
});

function handleSiteOpen(url) {
    const tabId = sitesTabs.get(url);
    if (tabId) {
        chrome.tabs.get(tabId, (tab) => {
            if (chrome.runtime.lastError) {
                createNewTab(url);
            } else {
                chrome.tabs
                    .update(tabId, { active: true })
                    .catch(() => createNewTab(url));
            }
        });
    } else {
        createNewTab(url);
    }
}

function createNewTab(url) {
    chrome.tabs.create({ url: url }, (tab) => {
        sitesTabs.set(url, tab.id);
    });
}

chrome.tabs.onRemoved.addListener((tabId) => {
    for (const [url, id] of sitesTabs.entries()) {
        if (id === tabId) {
            sitesTabs.delete(url);
            break;
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        for (const [url, id] of sitesTabs.entries()) {
            if (id === tabId && !tab.url.startsWith(url)) {
                sitesTabs.delete(url);
            }
        }
    }
});

chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
        for (const [url] of sitesTabs.entries()) {
            if (tab.url && tab.url.startsWith(url)) {
                sitesTabs.set(url, tab.id);
                break;
            }
        }
    });
});
