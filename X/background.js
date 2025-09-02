const BASE_URL = "https://www.x.com/";

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: BASE_URL });
});
