function forceImageLoading() {
  for (const imageBox of document.querySelectorAll('.srpimagebox'))
    if (imageBox.querySelectorAll('img').length === 0) {
      addImageToImageBox(imageBox);
      preventDoubleImages(imageBox);
    }
}

function addImageToImageBox(imageBox) {
  const src = imageBox.getAttribute('data-imgsrc');
  if (src !== null) {
    const image = document.createElement('img');
    image.src = src;
    image.setAttribute('data-added-by-rukaf', true);
    imageBox.appendChild(image);
  }
}

// Make sure our manually added image is removed once it's loaded by the website
function preventDoubleImages(imageBox) {
  const observer = new MutationObserver(() => {
    if (imageBox.querySelectorAll('img').length > 1)
      imageBox.querySelector('img[data-added-by-rukaf]').remove();
  });
  observer.observe(imageBox, {subtree: true, childList: true});
}
