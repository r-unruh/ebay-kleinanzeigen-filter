async function main() {
  // Load HTML
  const res = await fetch(chrome.runtime.getURL('templates.html'));
  const html = await res.text();
  document.querySelector('body').insertAdjacentHTML('beforeend', html);

  // Setup components
  const settingsComponent = new SettingsComponent('#rukaf-settings');
  const menu = new MenuComponent('#rukaf-menu', settingsComponent);

  settingsComponent.addEventListener('update', async () => {
    if (await getIsFilterEnabled()) {
      undoFilters();
      await applyFilters();
      await menu.render();
    }
  });

  if (await getIsFilterEnabled()) {
    await applyFilters();
    await menu.render();
  }
}

main();
