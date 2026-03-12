const THEME_IMAGES_WEB = {
  brown: [
    "s/img/litesite-web/litesite-brown-tr-index.webp",
    "s/img/litesite-web/litesite-brown-tr-product.webp",
    "s/img/litesite-web/litesite-brown-en-index.webp",
    "s/img/litesite-web/litesite-brown-en-product.webp",
    "s/img/litesite-web/litesite-brown-ar-index.webp",
    "s/img/litesite-web/litesite-brown-ar-product.webp",
  ],
  blue: [
    "s/img/litesite-web/litesite-blue-tr-index.webp",
    "s/img/litesite-web/litesite-blue-tr-product.webp",
  ],
  red: [
    "s/img/litesite-web/litesite-red-tr-index.webp",
    "s/img/litesite-web/litesite-red-tr-product.webp",
    "s/img/litesite-web/litesite-red-tr-hakkimizda.webp",
    "s/img/litesite-web/litesite-red-tr-menü.webp",
  ],
  pink: [
    "s/img/litesite-web/litesite-pink-tr-index.webp",
    "s/img/litesite-web/litesite-pink-tr-product.webp",
    "s/img/litesite-web/litesite-pink-tr-hakkimizda.webp",
    "s/img/litesite-web/litesite-pink-tr-menü.webp",
  ],
};

const THEME_IMAGES_MOBILE = {
  brown: [
    "s/img/litesite-mobil/brown-tr-index.webp",
    "s/img/litesite-mobil/brown-tr-product.webp",
    "s/img/litesite-mobil/brown-en-index.webp",
    "s/img/litesite-mobil/brown-en-product.webp",
    "s/img/litesite-mobil/brown-ar-index.webp",
    "s/img/litesite-mobil/brown-ar-product.webp",
  ],
  blue: [
    "s/img/litesite-mobil/blue-tr-index.webp",
    "s/img/litesite-mobil/blue-tr-product.webp",
  ],
  red: [
    "s/img/litesite-mobil/red-tr-index.webp",
    "s/img/litesite-mobil/red-tr-product.webp",
    "s/img/litesite-mobil/red-tr-hakkimizda.webp",
    "s/img/litesite-mobil/red-tr-menü.webp",
  ],
  pink: [
    "s/img/litesite-mobil/pink-tr-index.webp",
    "s/img/litesite-mobil/pink-tr-product.webp",
    "s/img/litesite-mobil/pink-tr-hakkimizda.webp",
    "s/img/litesite-mobil/pink-tr-menü.webp",
  ],
};

const VIEW_MODE_WEB = "web";
const VIEW_MODE_MOBILE = "mobile";
const MOBILE_VIEW_CLASS = "mobile-view";
const DETAIL_ACTIVE_CLASS = "active";

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
  return img;
}

function populateDetailImages(images, themeName) {
  detailImages.innerHTML = "";
  images.forEach(function (src) {
    detailImages.appendChild(createThemeImage(src, themeName));
  });
}

function openThemeDetail(themeName) {
  const images = getActiveThemeImages()[themeName];
  if (!images) { return; }

  currentOpenTheme = themeName;
  populateDetailImages(images, themeName);
  detailView.classList.add(DETAIL_ACTIVE_CLASS);
  viewToggle.classList.add(DETAIL_ACTIVE_CLASS);
  detailView.scrollTop = 0;
}

function closeThemeDetail() {
  currentOpenTheme = null;
  detailView.classList.remove(DETAIL_ACTIVE_CLASS);
  viewToggle.classList.remove(DETAIL_ACTIVE_CLASS);
}

function toggleViewMode() {
  if (currentViewMode === VIEW_MODE_WEB) {
    currentViewMode = VIEW_MODE_MOBILE;
    viewToggle.textContent = "Web";
    detailImages.classList.add(MOBILE_VIEW_CLASS);
  } else {
    currentViewMode = VIEW_MODE_WEB;
    viewToggle.textContent = "Mobil";
    detailImages.classList.remove(MOBILE_VIEW_CLASS);
  }

  if (currentOpenTheme) {
    populateDetailImages(getActiveThemeImages()[currentOpenTheme], currentOpenTheme);
    detailView.scrollTop = 0;
  }
}

catalogGrid.addEventListener("click", function (event) {
  const card = event.target.closest(".theme-card");
  if (!card) { return; }

  openThemeDetail(card.dataset.theme);
});

detailBack.addEventListener("click", closeThemeDetail);
viewToggle.addEventListener("click", toggleViewMode);
