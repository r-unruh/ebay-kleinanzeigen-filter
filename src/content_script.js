async function main() {
  // Load HTML
  const res = await fetch(chrome.runtime.getURL('templates.html'));
  const html = await res.text();
  document.querySelector('body').insertAdjacentHTML('beforeend', html);

  // Load filters
  await loadFilters();

  // Setup global components
  new SidebarMenu();

  // Setup ad components
  // All user-ads have an h2 tag, so make sure all items contain it.
  const elements = [...document
    .querySelectorAll('.ad-listitem')]
    .filter(e => e.querySelector('h2') !== null);
  for (const e of elements) {
    ADS.push(new AdComponent(e));
  }

  applyFilters();

  // Remove all sponsored ads
  [...document.querySelectorAll('[data-liberty-position-name]')]
    .map(e => e.parentElement)
    .forEach(e => e.remove());

  // Remove all highlighting from ads
  [...document.querySelectorAll(".is-highlight")]
    .forEach(e => e.classList.remove("is-highlight"));

  // Move top ads to the bottom
  [...document.querySelectorAll(".is-topad")]
    .forEach(e => e.parentNode.appendChild(e));
}

main();
