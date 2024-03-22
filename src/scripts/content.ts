import { settingsType } from "@/lib/chrome"

interface StorageData {
  settings: settingsType;
  clickedLinks?: Set<string>;
}

// global variable to store clicked links
let clickedLinks = new Set<string>()

// add some test data
clickedLinks.add('https://www.google.com')
clickedLinks.add('https://www.yahoo.com')
clickedLinks.add('https://www.bing.com')

console.log("I am in content.ts")

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
    clickedLinks.add(url)
    /*
    chrome.storage.local.set({clickedLinks});
    */
}

const applyNewSettings = (data: StorageData) => {
    console.log("I am in applyNewSettings")
    console.log(data.settings)

    if (data.settings.isEnabled) {
        const typedData = data as StorageData
        typedData.clickedLinks = clickedLinks
        applyLinkStyles(typedData)
        observeDOM(typedData);
    }
}
// Initial setup: Get settings and apply styles
chrome.storage.sync.get(['settings'], (data) => {
    const typedData = data as StorageData
    applyNewSettings(typedData)
})

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.message === "settingsUpdated") {
        const typedData = request as StorageData
        applyNewSettings(typedData)
    }
  }
)