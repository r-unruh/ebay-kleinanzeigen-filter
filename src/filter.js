const _hiddenClassName = 'rukaf-hidden-item';

async function applyFilters() {
  hideAdsByWords(await getBadWords());

  if (await getHideTopAds())
    hideTopAds();

  // Article Images are loaded lazily by scrolling position. If we remove
  // articles, they are not properly loaded anymore. We fix this by loading
  // images manually.
  forceImageLoading();
}

function hideAdsByWords(words) {
  getUserAds().forEach(e => {
    const header = e.querySelector('h2').firstElementChild.innerText;
    const user = e.querySelector('.text-module-oneline span')?.innerText ?? '';

    for (const word of words.map(word => word.toLowerCase()))
      if (header.toLowerCase().includes(word)
          || user.toLowerCase().includes(word))
        e.classList.add(_hiddenClassName);
  });
}

async function undoFilters() {
  getUserAds().forEach(e => e.classList.remove(_hiddenClassName));
}

function hideTopAds() {
  getUserAds().forEach(e => {
    if (e.classList.contains('is-topad'))
      e.classList.add(_hiddenClassName);
  });
}

function getFilteredCount() {
  return document.querySelectorAll(`.${_hiddenClassName}`).length;
}

function getUserAds() {
  // All user-ads have an h2 tag, so make sure all items contain it.
  return [...document.querySelectorAll('.ad-listitem')]
      .filter(e => e.querySelector('h2') !== null);
}
