export const defaultSettings = {
  isEnabled: false,
  selectedScheme: "protanopia",
  VisitedColor: "#FF8C00",
  UnvisitedColor: "#708090",
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
        reject(defaultSettings);
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


export interface settingsType {
    isEnabled: boolean;
    selectedScheme: string;
    VisitedColor: string;
    UnvisitedColor: string;
    colorSchemes: {
        key: string;
        desc: string;
        visited: string;
        unvisited: string;
    }[];
}

const setSettings = (settings: settingsType) => {
    console.log("In setSettings", settings)
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ settings }, () => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError)
          }
          resolve(true)
        });
    })
}

export const saveSettings = async (settings: settingsType) => {
    try {
        await setSettings(settings)
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
  } catch (defaultSettings) {
    console.log("Loading default settings");
    return defaultSettings;
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
