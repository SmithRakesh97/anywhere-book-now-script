/* =========================================
   Anywhere Book-Now Popup — Optimized JS
   ========================================= */

let isBookingPageLoaded = false;
let popupEls = null;
let globalClickBound = false;

/* ---- constants ---- */
const POPUP_WIDTH = 545;
const POPUP_PADDING = 100;
const MAX_IFRAME_HEIGHT = 635;

/* ---- show / hide emulation ---- */
const displayCache = new WeakMap();

function hide(el) {
  if (!displayCache.has(el)) {
    displayCache.set(el, getComputedStyle(el).display);
  }
  el.style.display = "none";
}

function show(el) {
  el.style.display = displayCache.get(el) || "block";
}

/* ---- iframe load handler ---- */
function initialFrameLoad() {
  hide(popupEls.loader);
  show(popupEls.iframeWrap);

  const iframeWindowHeight = window.innerHeight;
  const fancyBoxHeight = popupEls.popup.offsetHeight;

  popupEls.content.style.height =
    iframeWindowHeight > fancyBoxHeight
      ? `${MAX_IFRAME_HEIGHT}px`
      : `${iframeWindowHeight - 50}px`;
}

/* ---- popup creation ---- */
function renderTemplate() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="anywhere-overlay"></div>

    <div id="anywhere-fancy-box">
      <button id="anywhere-fancy-box-close-icon">✕</button>
      <div id="anywhere-fancy-box-content">
        <div class="iframe_loader"></div>
        <div id="iframeContent"></div>
      </div>
    </div>
    `
  );

  popupEls = {
    overlay: document.getElementById("anywhere-overlay"),
    popup: document.getElementById("anywhere-fancy-box"),
    content: document.getElementById("anywhere-fancy-box-content"),
    iframeWrap: document.getElementById("iframeContent"),
    loader: document.querySelector(".iframe_loader"),
  };

  popupEls.iframe = document.createElement("iframe");
  popupEls.iframe.id = "anywhere-fancy-box-iframe";
  popupEls.iframe.allow = "web-share; payment";
  popupEls.iframe.frameBorder = "0";
  popupEls.iframe.scrolling = "auto";
  popupEls.iframe.onload = initialFrameLoad;

  popupEls.iframeWrap.appendChild(popupEls.iframe);
}

/* ---- iframe handling ---- */
function loadIframe(src) {
  show(popupEls.loader);
  hide(popupEls.iframeWrap);
  popupEls.iframe.src = src;
}

/* ---- positioning ---- */
function positionPopup() {
  const scrollTop = window.pageYOffset;
  const windowHeight = window.innerHeight;

  popupEls.overlay.style.height =
    document.documentElement.offsetHeight + "px";

  popupEls.popup.style.marginLeft = `-${POPUP_WIDTH / 2}px`;
  popupEls.popup.style.marginTop =
    (windowHeight - (windowHeight - POPUP_PADDING)) / 2 + scrollTop + "px";

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

/* ---- show / hide ---- */
function hidePopup() {
  hide(popupEls.overlay);
  hide(popupEls.popup);
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

function showPopup() {
  show(popupEls.overlay);
  show(popupEls.popup);
}

/* ---- main popup ---- */
function anywherePopup(e, bookingPageLink) {
  e.preventDefault();
  e.stopImmediatePropagation();

  if (window.innerWidth < 600) {
    window.open(bookingPageLink, "_blank");
    return;
  }

  if (!isBookingPageLoaded) {
    isBookingPageLoaded = true;
    renderTemplate();
  }

  loadIframe(bookingPageLink);
  positionPopup();
  showPopup();

  if (!globalClickBound) {
    globalClickBound = true;
    document.addEventListener("click", (evt) => {
      if (
        evt.target.closest("#anywhere-overlay") ||
        evt.target.closest("#anywhere-fancy-box-close-icon")
      ) {
        hidePopup();
      }
    });
  }
}

/* ---- brand safety ---- */
const ALLOWED_BRANDS = [
  "anywhere.com",
  "setmore.com",
  "inthechar.com",
  "serviceforge.com",
];

function isAllowedBrand(hostname) {
  return ALLOWED_BRANDS.some(
    (d) => hostname === d || hostname.endsWith("." + d)
  );
}

/* ---- DOM ready ---- */
document.addEventListener("DOMContentLoaded", () => {
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href =
    "https://smithrakesh97.github.io/anywhere-book-now-css/anywhere-book-now.css";
  document.head.appendChild(css);

  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("#Anywhere_button_iframe");
    if (!anchor) return;

    const url = new URL(anchor.href);
    const safeUrl = isAllowedBrand(url.hostname)
      ? anchor.href
      : "https://booking.anywhere.com" +
        (url.pathname + url.search || "/invalidurl");

    anywherePopup(e, safeUrl);
  });
});
