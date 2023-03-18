class FilterApplier {
  static hiddenClassName = 'ruekaf-hidden-item';

  async apply() {
    this.#removeSlowLoadingPromotedAds();

    this.#filterBadWords(await getBadWords());

    if (await getRemoveProAds())
      this.#filterProAds();

    // Article Images are loaded lazily by scrolling position. If we remove
    // articles, they are not properly loaded anymore. We fix this by loading
    // images manually.
    this.#forceImageLoading();
  }

  // Promoted items are loading slowly and their title is '' before they're
  // loaded. Remove them instead of waiting for them to appear. They are not
  // useful most of the time anyway. If they do load in time, handle them like a
  // regular user ad.
  #removeSlowLoadingPromotedAds() {
    this.#getAllItems().forEach(e => {
      if (this.#getTitleFromItemElement(e) === '')
        return e.remove();
    });
  }

  #filterBadWords(words) {
    this.#getAllItems().forEach(e => {
      const headerText = this.#getTitleFromItemElement(e);
      const searchableHeaderText = headerText.toLowerCase();

      for (const word of words)
        if (searchableHeaderText.includes(word.toLowerCase()))
          e.classList.add(FilterApplier.hiddenClassName);
    });
  }

  #filterProAds() {
    this.#getAllItems().forEach(e => {
      if (e.querySelector('.badge-hint-pro-small-srp'))
        e.classList.add(FilterApplier.hiddenClassName);
    });
  }

  #forceImageLoading() {
    for (const imageBox of document.querySelectorAll('.srpimagebox'))
      if (!this.#isImageBoxFilled(imageBox)) {
        this.#addImageToImageBox(imageBox);
        this.#preventDoubleImages(imageBox);
      }
  }

  #isImageBoxFilled(imageBox) {
    return imageBox.querySelectorAll('img').length > 0;
  }

  #addImageToImageBox(imageBox) {
    const src = imageBox.getAttribute('data-imgsrc');
    if (src !== null) {
      const image = document.createElement('img');
      image.src = src;
      image.setAttribute('data-added-by-eka-filter', true);
      imageBox.appendChild(image);
    }
  }

  // Remove our manually added image once it's loaded by EKA
  #preventDoubleImages(imageBox) {
    const observer = new MutationObserver(() => {
      if (imageBox.querySelectorAll('img').length > 1)
        imageBox.querySelector('img[data-added-by-eka-filter]').remove();
    });
    observer.observe(imageBox, {subtree: true, childList: true});
  }

  #getAllItems() {
    return document.querySelectorAll(
        '.ad-listitem.lazyload-item, .ad-listitem.native-ad');
  }

  #getTitleFromItemElement(item) {
    const headerElement = item.querySelector('h2');
    return headerElement.querySelector('a') !== null
        ? headerElement.querySelector('a').innerText
        : headerElement.innerText;
  }

  undo() {
    this.#getAllItems().forEach(e => {
      e.classList.remove(FilterApplier.hiddenClassName);
    });
  }

  get filteredCount() {
    return document.querySelectorAll(
      `.${FilterApplier.hiddenClassName}`).length;
  }
}
