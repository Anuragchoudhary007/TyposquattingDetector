document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const targetDomain = params.get('target');
  const visitedDomain = params.get('visited');

  const visitedEl = document.getElementById('visited-domain');
  const targetEl = document.getElementById('target-domain');
  const safeButton = document.getElementById('safe-button');
  const unsafeLink = document.getElementById('unsafe-link');

  visitedEl.textContent = visitedDomain;
  targetEl.textContent = targetDomain;

  safeButton.onclick = () => {
    // Redirects the user to the correct, safe domain
    chrome.tabs.update({ url: `https://${targetDomain}` });
  };

  unsafeLink.onclick = (e) => {
    e.preventDefault();
    // Redirects the user back to the *original* visited domain
    chrome.tabs.update({ url: `https://${visitedDomain}` });
  };
});