class MenuComponent {
  #filterApplier;
  #settingsComponent;

  constructor(selector, filterApplier, settingsComponent) {
    this.element = document.querySelector(selector)
        .content.firstElementChild.cloneNode(true);
    document.querySelector('body').appendChild(this.element);

    this.#filterApplier = filterApplier;
    this.#settingsComponent = settingsComponent;

    this.element.querySelector('img').src =
        chrome.runtime.getURL('/images/icon_96.png');

    this.#bindEvents();
    this.render();
  }

  #bindEvents() {
    this.element.querySelector('a[data-edit]')
        .addEventListener('click', async e => {
      e.preventDefault();
      await this.#settingsComponent.show();
    });

    this.element.querySelector('a[data-enable]')
        .addEventListener('click', async e => {
      e.preventDefault();
      await this.#filterApplier.apply();
      await setIsFilterEnabled(true);
      await this.render();
    });

    this.element.querySelector('a[data-disable]')
        .addEventListener('click', async e => {
      e.preventDefault();
      this.#filterApplier.undo();
      await setIsFilterEnabled(false);
      await this.render();
    });
  }

  async render() {
    const enabled = await getIsFilterEnabled();
    this.element.querySelector('[data-message-disabled]').hidden = enabled;
    this.element.querySelector('[data-message-filtered]').hidden = !enabled;
    this.element.querySelector('[data-disable]').hidden = !enabled;
    this.element.querySelector('[data-enable]').hidden = enabled;

    if (enabled)
      this.element.querySelector('[data-filtered-count]').innerHTML
          = this.#filterApplier.filteredCount;
  }
}
