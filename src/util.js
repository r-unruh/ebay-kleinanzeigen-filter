// Globals
const FILTERS = {
  words: new Set(),
  ids: new Set(),
};
const ADS = [];

async function loadFromStorage(key) {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, result => {
      resolve(result[key]);
    });
  });
}

async function saveToStorage(key, value) {
  return new Promise(resolve => {
    chrome.storage.sync.set({[key]: value}, resolve);
  });
}

async function loadFilters() {
  FILTERS.words = new Set(await loadFromStorage('badWords') ?? []);
  FILTERS.ids = new Set(await loadFromStorage('ids') ?? []);
}

async function saveFilters() {
  // Limit max number of ids
  while (FILTERS.ids.size > 1000) {
      FILTERS.ids.delete(FILTERS.ids.values().next().value);
  }

  await saveToStorage('ids', [...FILTERS.ids]);
  await saveToStorage('badWords', [...FILTERS.words]);
}

function applyFilters() {
  for (const ad of ADS) {
    ad.applyFilters();
  }
}
