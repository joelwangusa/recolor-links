export interface settingsType {
    isEnabled: boolean;
    selectedScheme: string;
    visitedColor: string;
    unvisitedColor: string;
    colorSchemes: {
        key: string;
        desc: string;
        visited: string;
        unvisited: string;
    }[];
}

export const defaultSettings = {
  isEnabled: false,
  selectedScheme: "protanopia",
  visitedColor: "#FF8C00",
  unvisitedColor: "#708090",
  colorSchemes : [
    {
      key: "custom",
      desc: "Custom Scheme",
      visited: '#FF8C00', // Deep Orange
      unvisited: '#708090' // Slate Gray
    },
    {
      key: "protanopia",
      desc: "Red-green color deficiency",
      visited: '#0000FF', // Blue
      unvisited: '#FFFF00' // Yellow
    },
    {
      key: "tritanopia",
      desc: "Blue-yellow color deficiency",
      visited: '#FF00FF', // Magenta
      unvisited: '#00FF00' // Green
    },
    {
      key: "monochromacy",
      desc: "Complete color deficiency",
      visited: '#555555', // Gray
      unvisited: '#AAAAAA' // Light Gray
    },
  ]
}

const getSettings = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('settings', (results) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (results.settings) {
        resolve(results.settings);
      } else {
        reject(null);
      }
    });
  });
}

const getLinks = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('settings', (results) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (results.links) {
        resolve(results.links);
      } else {
        reject({});
      }
    });
  });
}

interface linksType {
    [key: string]: number;
}

const setLinks = (links: linksType) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ links }, () => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        resolve(true);
        });
    });
}

export function sendMessageToContent(data :{message: string, settings: settingsType}) {
  if (chrome.runtime) {
    chrome.runtime.sendMessage(data);
  }
}

const saveSettingsToStorage = (settings: settingsType) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ settings }, () => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError)
          }
          resolve(true)
        });
    })
}

// Notify the content script that the settings have been updated
const notifyContentScript = (settings: settingsType) => {
    console.log("notifyContentScript", settings)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].id !== undefined) {
          chrome.tabs.sendMessage(tabs[0].id, { message: "settingsUpdated", settings });
        }
    });
}

export const saveSettings = async (settings: settingsType) => {
    try {
        await saveSettingsToStorage(settings)
        notifyContentScript(settings)
    } catch (error) {
        console.error(error)
    }
}

export const saveNewLink = async (links: linksType, url: string) => {
  try {
    links[url] = Date.now()
    setLinks(links)
    return links
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const loadSettings = async () => {
  try {
    const settings = await getSettings();
    return settings;
  } catch (error) {
    console.error(error);
  }
}

export const loadLinks = async () => {
  try {
    let links = await getLinks();
    return links;
  } catch (error) {
    console.error(error);
    return [];
  }
}
