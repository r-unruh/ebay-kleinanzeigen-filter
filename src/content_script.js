async function main() {
  await loadTemplates();

  const filterApplier = new FilterApplier();
  const settingsComponent = new SettingsComponent('#ruekaf-settings');
  const menu = new MenuComponent(
      '#ruekaf-menu', filterApplier, settingsComponent);

  if (await getIsFilterEnabled()) {
    await filterApplier.apply();
    await menu.render();
  }

  settingsComponent.addEventListener('update', async () => {
    if (await getIsFilterEnabled()) {
      filterApplier.undo();
      await filterApplier.apply();
      await menu.render();
    }
  });
}

async function loadTemplates() {
  const html = await getHtml('templates.html');
  document.querySelector('body').insertAdjacentHTML('beforeend', html);
}

async function getHtml(file) {
  const res = await fetch(chrome.runtime.getURL(file));
  return await res.text();
}

main();
