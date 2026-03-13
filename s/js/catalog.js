const THEME_IMAGES_WEB = {
  brown: [
    "s/img/litesite-web/litesite-brown-tr-index.png",
    "s/img/litesite-web/litesite-brown-tr-product.png",
    "s/img/litesite-web/litesite-brown-en-index.png",
    "s/img/litesite-web/litesite-brown-en-product.png",
    "s/img/litesite-web/litesite-brown-ar-index.png",
    "s/img/litesite-web/litesite-brown-ar-product.png",
  ],
  blue: [
    "s/img/litesite-web/litesite-blue-tr-index.png",
    "s/img/litesite-web/litesite-blue-tr-product.png",
  ],
  red: [
    "s/img/litesite-web/litesite-red-tr-index.png",
    "s/img/litesite-web/litesite-red-tr-product.png",
    "s/img/litesite-web/litesite-red-tr-hakkimizda.png",
    "s/img/litesite-web/litesite-red-tr-menu.png",
  ],
  pink: [
    "s/img/litesite-web/litesite-pink-tr-index.png",
    "s/img/litesite-web/litesite-pink-tr-product.png",
    "s/img/litesite-web/litesite-pink-tr-hakkimizda.png",
    "s/img/litesite-web/litesite-pink-tr-menu.png",
  ],
};

const THEME_IMAGES_MOBILE = {
  brown: [
    "s/img/litesite-mobil/brown-tr-index.png",
    "s/img/litesite-mobil/brown-tr-product.png",
    "s/img/litesite-mobil/brown-en-index.png",
    "s/img/litesite-mobil/brown-en-product.png",
    "s/img/litesite-mobil/brown-ar-index.png",
    "s/img/litesite-mobil/brown-ar-product.png",
  ],
  blue: [
    "s/img/litesite-mobil/blue-tr-index.png",
    "s/img/litesite-mobil/blue-tr-product.png",
  ],
  red: [
    "s/img/litesite-mobil/red-tr-index.png",
    "s/img/litesite-mobil/red-tr-product.png",
    "s/img/litesite-mobil/red-tr-hakkimizda.png",
    "s/img/litesite-mobil/red-tr-menu.png",
  ],
  pink: [
    "s/img/litesite-mobil/pink-tr-index.png",
    "s/img/litesite-mobil/pink-tr-product.png",
    "s/img/litesite-mobil/pink-tr-hakkimizda.png",
    "s/img/litesite-mobil/pink-tr-menu.png",
  ],
};

const VIEW_MODE_WEB = "web";
const VIEW_MODE_MOBILE = "mobile";
const MOBILE_VIEW_CLASS = "mobile-view";
const DETAIL_ACTIVE_CLASS = "active";
const THEME_CARD_SELECTOR = "#catalog-grid > div";
const THEME_DATA_ATTRIBUTE = "theme";
const LABEL_WEB = "Web";
const LABEL_MOBILE = "Mobil";
const KEY_ESCAPE = "Escape";

const catalogGrid = document.getElementById("catalog-grid");
const detailView = document.getElementById("detail-view");
const detailImages = document.getElementById("detail-images");
const detailBack = document.getElementById("detail-back");
const viewToggle = document.getElementById("view-toggle");

let currentViewMode = VIEW_MODE_WEB;
let currentOpenTheme = null;

function getActiveThemeImages() {
  return currentViewMode === VIEW_MODE_WEB ? THEME_IMAGES_WEB : THEME_IMAGES_MOBILE;
}

function createThemeImage(src, themeName) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = themeName;
  img.loading = "lazy";
  return img;
}

function populateDetailImages(images, themeName) {
  detailImages.innerHTML = "";
  images.forEach(function (src) {
    detailImages.appendChild(createThemeImage(src, themeName));
  });
}

function showDetailView() {
  detailView.classList.add(DETAIL_ACTIVE_CLASS);
  viewToggle.classList.add(DETAIL_ACTIVE_CLASS);
  detailView.scrollTop = 0;
}

function openThemeDetail(themeName) {
  const images = getActiveThemeImages()[themeName];
  if (!images) { return; }

  currentOpenTheme = themeName;
  populateDetailImages(images, themeName);
  showDetailView();
}

function closeThemeDetail() {
  currentOpenTheme = null;
  detailView.classList.remove(DETAIL_ACTIVE_CLASS);
  viewToggle.classList.remove(DETAIL_ACTIVE_CLASS);
}

function activateMobileView() {
  currentViewMode = VIEW_MODE_MOBILE;
  viewToggle.textContent = LABEL_WEB;
  detailImages.classList.add(MOBILE_VIEW_CLASS);
}

function activateWebView() {
  currentViewMode = VIEW_MODE_WEB;
  viewToggle.textContent = LABEL_MOBILE;
  detailImages.classList.remove(MOBILE_VIEW_CLASS);
}

function toggleViewMode() {
  if (currentViewMode === VIEW_MODE_WEB) {
    activateMobileView();
  } else {
    activateWebView();
  }

  if (currentOpenTheme) {
    populateDetailImages(getActiveThemeImages()[currentOpenTheme], currentOpenTheme);
    detailView.scrollTop = 0;
  }
}

catalogGrid.addEventListener("click", function (event) {
  const card = event.target.closest(THEME_CARD_SELECTOR);
  if (!card) { return; }

  openThemeDetail(card.dataset[THEME_DATA_ATTRIBUTE]);
});

document.addEventListener("keydown", function (event) {
  if (event.key === KEY_ESCAPE) { closeThemeDetail(); }
});

detailBack.addEventListener("click", closeThemeDetail);
viewToggle.addEventListener("click", toggleViewMode);
