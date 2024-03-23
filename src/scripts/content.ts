import { settingsType } from "@/lib/chrome"

chrome.runtime.sendMessage({ type: 'content-ready' });

interface StorageData {
  settings: settingsType;
}

// global variable to store clicked links
let clickedLinks = new Set<string>()

// Function to apply styles to links based on click events
function applyLinkStyles(data: StorageData) {
    document.querySelectorAll('a').forEach(link => {
        // Remove previously added event listeners to avoid duplicates
        // link.removeEventListener('click', linkClickHandler);
        link.removeEventListener('click', linkClickHandler.bind(null, data.settings.visitedColor, link.href));
        // Apply initial style based on settings
        link.style.color = data.settings.unvisitedColor

        // Add click event listener to change color upon click
        link.addEventListener('click', linkClickHandler.bind(null, data.settings.visitedColor, link.href));
        // Check clicked history apply the link styles if it is clicked
        if (clickedLinks.has((link as HTMLAnchorElement).href)) {
            link.style.color = data.settings.visitedColor; 
        }
    });
}

// Observe the DOM for changes and reapply styles
function observeDOM(data: StorageData) {
    const observer = new MutationObserver(() => {
        applyLinkStyles(data);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Handler for link click events, changes color
function linkClickHandler(visitedColor: string, url: string, event: MouseEvent) {
    // Change the color after link click
    (event.target as HTMLElement).style.color = visitedColor;

    // Update local storage with every click
    updateLocalStorageWithClick(url);
}

function updateLocalStorageWithClick(url: string) {
    // if url is empty or already clicked, return
    if (!url || clickedLinks.has(url)) {
        return;
    }

    clickedLinks.add(url)
    const message = "newClickedLink"
    // send message to background.js to save the clicked link
    chrome.runtime.sendMessage({message, url});
}

const applyNewSettings = (data: StorageData) => {
    if (data.settings && data.settings.isEnabled) {
        const typedData = data as StorageData
        applyLinkStyles(typedData)
        observeDOM(typedData);
    }
}

const getClickedLinks = (): Promise<Set<string>> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['clickedLinks'], (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                clickedLinks = new Set(data.clickedLinks);
                resolve(clickedLinks as Set<string>);
            }
        });
    })
}


// Initial setup: Get settings and apply styles
const getStorageData = (): Promise<StorageData> => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['settings', 'clickedLinks'], (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data as StorageData);
            }
        });
    });
}

// Initial setup: Get settings and apply styles
const setup = async () => {
    const typedData = await getStorageData();
    await getClickedLinks()
    applyNewSettings(typedData);
}


// Listen for messages from popup.js to update settings
chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.message === "settingsUpdated") {
        const typedData = {"settings": request.settings} as StorageData
        applyNewSettings(typedData)
    }
  }
)

window.onbeforeunload = function() {
    try {
        chrome.runtime.sendMessage({message: "tabClosing"});
    } catch (error) {
        console.error("Failed to send message: ", error);
    }
}

setup()