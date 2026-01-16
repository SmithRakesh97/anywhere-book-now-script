/* =========================================
   Anywhere Book-Now Popup — Final Plain JS
   ========================================= */

let isBookingPageLoaded = false;

/* ---- jQuery show / hide emulation ---- */
const displayCache = new Map();

function jqHide(el) {
  if (!displayCache.has(el)) {
    displayCache.set(el, getComputedStyle(el).display);
  }
  el.style.display = "none";
}

function jqShow(el) {
  const prev = displayCache.get(el);
  el.style.display = prev && prev !== "none" ? prev : "block";
}

/* ---- iframe load handler ---- */
function initialFrameLoad() {
  document.querySelectorAll(".iframe_loader").forEach(jqHide);
  jqShow(document.getElementById("iframeContent"));

  const content = document.getElementById("anywhere-fancy-box-content");
  const iframeWindowHeight = window.innerHeight;

  content.style.height =
    iframeWindowHeight > 700 ? "635px" : `${iframeWindowHeight - 50}px`;
}

/* ---- main popup ---- */
function anywherePopup(e, bookingPageLink) {
  e.preventDefault();
  e.stopPropagation();
  if (e.stopImmediatePropagation) e.stopImmediatePropagation();

  if (window.innerWidth < 600) {
    window.open(bookingPageLink, "_blank");
    return;
  }

  const overlayHTML = `<div id="anywhere-overlay"></div>`;
  const popupHTML = `
    <div id="anywhere-fancy-box">
      <button id="anywhere-fancy-box-close-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
          <path d="M1.3335 0.674316L10.6668 10.0076" stroke="#EFF3F9" stroke-linecap="round"/>
          <path d="M10.6668 0.674316L1.3335 10.0076" stroke="#EFF3F9" stroke-linecap="round"/>
        </svg>
      </button>

      <div id="anywhere-fancy-box-content">
        <div class="int-loader-wrap iframe_loader">
          <svg fill="none" viewBox="0 0 50 50" class="animate-loading-spin">
            <circle cx="25" cy="25" r="20" class="animate-loading-dash"/>
          </svg>
        </div>
        <div id="iframeContent" style="height:100%;width:100%"></div>
      </div>
    </div>
  `;

  function renderTemplate() {
    document.body.insertAdjacentHTML("beforeend", overlayHTML + popupHTML);

    resetPopupStyles();   // ✅ IMPORTANT
    lockScroll();
    loadIframe();
  }

  function loadIframe() {
    jqShow(document.querySelector(".iframe_loader"));
    jqHide(document.getElementById("iframeContent"));

    document.getElementById("iframeContent").innerHTML = `
      <iframe
        allow="web-share; payment"
        id="anywhere-fancy-box-iframe"
        frameborder="0"
        scrolling="auto"
        src="${bookingPageLink}">
      </iframe>
    `;

    document.getElementById("anywhere-fancy-box-iframe").onload =
      initialFrameLoad;
  }

  function resetPopupStyles() {
    const popup = document.getElementById("anywhere-fancy-box");

    /* 🔥 Remove ALL legacy inline positioning */
    popup.style.marginLeft = "";
    popup.style.marginTop = "";
    popup.style.left = "";
    popup.style.top = "";
  }

  function lockScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }

  function hidePopup() {
    jqHide(document.getElementById("anywhere-overlay"));
    jqHide(document.getElementById("anywhere-fancy-box"));
    unlockScroll();
  }

  function showPopup() {
    resetPopupStyles();   // ✅ FIXES DRIFT ON REOPEN
    jqShow(document.getElementById("anywhere-overlay"));
    jqShow(document.getElementById("anywhere-fancy-box"));
    lockScroll();
  }

  document.addEventListener("click", (evt) => {
    if (
      evt.target.closest("#anywhere-overlay") ||
      evt.target.closest("#anywhere-fancy-box-close-icon")
    ) {
      hidePopup();
    }
  });

  if (!isBookingPageLoaded) {
    isBookingPageLoaded = true;
    renderTemplate();
  } else {
    loadIframe();
    showPopup();
  }
}

/* ---- DOM ready + delegated binding ---- */
document.addEventListener("DOMContentLoaded", () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://smithrakesh97.github.io/anywhere-book-now-css/anywhere-book-now.css";
  document.head.appendChild(link);

  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("#Anywhere_button_iframe");
    if (!anchor) return;

    let bookingPageLink = anchor.href;
    const parsed = new URL(bookingPageLink);

    if (!parsed.hostname.endsWith("anywhere.com")) {
      bookingPageLink =
        "https://booking.anywhere.com" + parsed.pathname + parsed.search;
    }

    anywherePopup(e, bookingPageLink);
  });
});
