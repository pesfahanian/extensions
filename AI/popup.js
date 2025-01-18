document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".site-icon");

    icons.forEach((icon) => {
        icon.addEventListener("click", () => {
            const url = icon.dataset.url;
            chrome.runtime.sendMessage({ action: "openSite", url: url });
        });
    });
});
