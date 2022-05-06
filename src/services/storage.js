import DOMPurify from 'dompurify';

const LINKS_KEY = '_CT_LINKS_';
const PULL_REQUESTS_KEY = '_CT_PULL_REQUESTS_';
const REPOSITORIES_CONFIG = '_CT_REPOSITORIES_CONFIG_';

function getStorageValue(key) {
  return DOMPurify.sanitize(sessionStorage.getItem(key));
}

function getKey(key) {
  var value = getStorageValue(key);
  console.debug('key: ' + key + ' value:' + value);
  if (value === undefined || value === null || value === 'null') {
    return [];
  }

  try {
    return JSON.parse(value);
  } catch (e) {
    console.error(e);
    return [];
  }
}

function setKey(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function reset() {
  sessionStorage.clear();
}

export function loadPullRequests() {
  var value = getStorageValue(PULL_REQUESTS_KEY);
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error(e);
  }

  return getStorageValue(PULL_REQUESTS_KEY);
}

export function savePullRequests(value) {
  setKey(PULL_REQUESTS_KEY, value)
}

export function loadLinks() {
  return getKey(LINKS_KEY);
}

export function saveLinks(value) {
  setKey(LINKS_KEY, value);
}

export function loadRepositoriesConfiguration() {
  return getKey(REPOSITORIES_CONFIG);
}

export function saveRepositoriesConfiguration(value) {
  sessionStorage.setItem(REPOSITORIES_CONFIG, value);
}

export function stats() {
  return {
    nbLinks: loadLinks().length,
    nbPullRequests: loadPullRequests()? loadPullRequests().length: 0
  };
}

