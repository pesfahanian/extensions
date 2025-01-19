const BASE_URL = "https://www.youtube.com/";

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: BASE_URL });
});
