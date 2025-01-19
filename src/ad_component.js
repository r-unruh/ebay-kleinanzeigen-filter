class AdComponent {
  constructor(e) {
    this.adElement = e;

    // Get ad data
    this.id = e.querySelector("article").getAttribute("data-adid");
    this.title = e.querySelector("h2").firstElementChild.innerText;
    this.user = e.querySelector(".text-module-oneline span")?.innerText ?? "";

    // Add fold button
    const foldButton = document
      .querySelector("#vimuser-fold-button")
      .content
      .firstElementChild
      .cloneNode(true);
    this.adElement.querySelector("article").append(foldButton);
    foldButton.addEventListener("click", async e => {
      e.preventDefault();
      FILTERS.ids.add(this.id);
      this.fold();
      await saveFilters();
    });

    // Add stub
    this.stubElement = document.querySelector("#vimuser-stub")
        .content.firstElementChild.cloneNode(true);
    this.adElement.append(this.stubElement);
    this.stubElement.innerText = this.title;

    this.stubElement.addEventListener("click", async e => {
      e.preventDefault();
      FILTERS.ids.delete(this.id);
      this.unfold();
      await saveFilters();
    });
  }

  applyFilters() {
    let fold = false;
    if (FILTERS.ids.has(this.id)) {
      this.fold();
      fold = true;
    }

    const title = this.title.toLowerCase();
    const user = this.user.toLowerCase();
    for (const word of FILTERS.words) {
      if (title.includes(word) || user.includes(word)) {
        this.fold();
        fold = true;
      }
    }

    // Add strikethrough
    this.stubElement.innerHTML = strikeText(this.title, [...FILTERS.words]);

    if (!fold) {
      this.unfold();
    }
  }

  fold() {
    this.adElement.classList.add("vimuser-folded");
    this.stubElement.classList.remove("vimuser-hidden");
  }

  unfold() {
    this.adElement.classList.remove("vimuser-folded");
    this.stubElement.classList.add("vimuser-hidden");
  }
}

function strikeText(text, badWords) {
    const escaped = badWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    return text.replace(regex, "<s>$1</s>");
}
