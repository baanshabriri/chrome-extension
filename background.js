async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const { action } = message;
  switch (action) {
    case 'CAPTURE_AREA_SCREENSHOT':
      const { options } = message;
      await startScreenshotProcess({ options });
      break;
    // no default
  }
});


async function startScreenshotProcess({ options }) {
  const activeTab = await getCurrentTab();
  const { id: tabId, title, url } = activeTab;

  console.log('Current tab from click event listener', tabId, title, url);

  await chrome.storage.local.set({ options });
  const { options: localOptions } = await chrome.storage.local.get('options');
  console.log(options);

  chrome.scripting.insertCSS({ files: ['content/content.css'], target: { tabId } })
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['content/content.js'],
    ...localOptions
  });
}
