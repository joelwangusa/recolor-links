let clickedLinks = new Set<string>()
let saveThreshold = 3
let saveInterval = 60 * 1000 // 1 minute
let newUpdate = false

// Initial background.js load the clickedLinks from storage
chrome.storage.local.get(['clickedLinks'], (data) => {
    if (data.clickedLinks){ 
        clickedLinks = new Set(data.clickedLinks);
    }
})

// Save the clickedLinks to storage when the extension is unloaded
chrome.runtime.onSuspend.addListener(() => {
    console.log("Unloading.");
    chrome.storage.local.set({clickedLinks: Array.from(clickedLinks)}, () => {
        console.log("Data saved.");
    });
});

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.message === "newClickedLink") {
        const url = request.url as string
        clickedLinks.add(url)
        newUpdate = true
        if (clickedLinks.size % saveThreshold === 0) {
            chrome.storage.local.set({clickedLinks: Array.from(clickedLinks)});
        }
    }
  }
)

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "tabClosing" && newUpdate) {
        chrome.storage.local.set({clickedLinks: Array.from(clickedLinks)}, () => {
            console.log("Data saved.");
        });
    }
})

// Save the clickedLinks to storage every minute
setInterval(() => {
    if (newUpdate) {
        chrome.storage.local.set({clickedLinks: Array.from(clickedLinks)})
    }
}, saveInterval)