const PROTECTED_DOMAINS = [
  "google.com",
  "amazon.com",
  "facebook.com",
  "microsoft.com",
];
const THRESHOLD = 2;

function levenshteinDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    try {
      const url = new URL(tab.url);
      const host = url.hostname;
      // Simple way to get the base domain (e.g., gets "google.com" from "www.google.com")
      const domainParts = host.split('.');
      const domain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : host;

      for (const protectedDomain of PROTECTED_DOMAINS) {
        const distance = levenshteinDistance(domain, protectedDomain);

        if (distance > 0 && distance <= THRESHOLD) {
          const warningPageUrl = chrome.runtime.getURL(`warning.html?target=${protectedDomain}&visited=${domain}`);
          chrome.tabs.update(tabId, { url: warningPageUrl });
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
});