// Remove affiliate ads from site

// Elements to be removed directly
let badElements = [
  ".sticky-advertisement",
  `[id$="-billboard"]`,
  `[data-liberty-position-name$="-middle"]`,
  `[data-liberty-position-name$="-bottom"]`,
];
for (const s of badElements) {
  [...document.querySelectorAll(s)].forEach(e => e.remove());
}

// Children of elements to be removed
const badChildren = [
  `[data-liberty-position-name$="-top"]`,
  `[data-liberty-position-name$="-top-banner"]`,
  `[data-liberty-position-name*="-result-list-"]`,
];
for (const s of badChildren) {
  [...document.querySelectorAll(s)]
    .map(e => e.parentElement)
    .forEach(e => e.remove());
}
