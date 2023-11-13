
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

document.getElementById("startProgrammaticCapture").addEventListener("click", async () => {
  // Get information about the currently active tab
  const activeTab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    files: ['content/content.js'],
    ...{ world: 'ISOLATED' }
  });
});

// when action icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // chrome.scripting.insertCSS({ files: ['content/content.css'], target: { tabId: tab.id } })
});



