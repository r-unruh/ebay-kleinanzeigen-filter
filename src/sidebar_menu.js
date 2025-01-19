class SidebarMenu {
  constructor() {
    // Create element
    this.element = document
      .querySelector("#vimuser-sidebar-menu")
      .content.firstElementChild.cloneNode(true);

    // Append to page
    const container = document.querySelector(".browsebox");
    container.insertBefore(this.element, container.children[3]);

    // Load data
    this.textarea = this.element.querySelector("textarea");
    this.textarea.value = [...FILTERS.words].join("\n");

    // Bind events
    this.form = this.element.querySelector("form");
    this.form.addEventListener("submit", async e => {
      e.preventDefault();
      this.textarea.value = this.textarea.value.toLowerCase();
      FILTERS.words =
        new Set(this.textarea.value.split("\n").filter(w => w !== ""));
      applyFilters();
      await saveFilters();
    });
  }
}
