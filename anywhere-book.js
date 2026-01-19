/* =========================================
   Anywhere Book-Now Popup — Final Plain JS
   (jQuery-equivalent behavior)
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

  const fancyBox = document.getElementById("anywhere-fancy-box");
  const content = document.getElementById("anywhere-fancy-box-content");

  const iframeWindowHeight = window.innerHeight;
  const fancyBoxHeight = fancyBox.offsetHeight;

  content.style.height =
    iframeWindowHeight > fancyBoxHeight
      ? "635px"
      : `${iframeWindowHeight - 50}px`;
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
    <div id="anywhere-fancy-box"
      style="background:#fff;height:auto;left:50%;position:absolute;top:0;width:545px;z-index:9999;">
      <button id="anywhere-fancy-box-close-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none"><path d="M1.3335 0.674316L10.6668 10.0076" stroke="#EFF3F9" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6668 0.674316L1.3335 10.0076" stroke="#EFF3F9" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div id="anywhere-fancy-box-content">
        <div class="int-loader-wrap iframe_loader">
            <div aria-hidden="true" id=":ri:" role="img" style="width:48px; height:48px; stroke-width:1; position:relative;" data-eds-component="true">
                <svg aria-hidden="true" data-eds-component="true" fill-rule="evenodd" focusable="false" preserveAspectRatio="xMidYMid meet" role="img" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg" style="height:20px; width:20px; fill: #111111; position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);">
                <path d="M210.833 216.666h-.583c0 64.948-38.039 140-116.084 140v-64.167c96.084.056 116.667-69.133 116.667-110.833V100h-.583c0 64.948-38.039 140-116.084 140v-64.167C190.25 175.889 210.834 106.7 210.834 65h58.334c0 41.7 20.582 110.889 116.666 110.833V240c-78.044 0-116.083-75.052-116.083-140h-.583v81.666c0 41.7 20.582 110.889 116.666 110.833v64.167c-78.044 0-116.083-75.052-116.083-140h-.583v198.333h-58.334V216.666z"></path>
                </svg>

                <svg fill="none" focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 50 50" class="animate-loading-spin block">
                <circle cx="25" cy="25" r="20" stroke-linecap="round" style="stroke:#111111;" class="animate-loading-dash"></circle>
                </svg>
            </div>
        </div>
        <div id="iframeContent" style="height:100%;width:100%"></div>
      </div>
    </div>
  `;

  function renderTemplate() {
    document.body.insertAdjacentHTML("beforeend", overlayHTML + popupHTML);
    positionPopup();
    loadIframe();
  }

  function loadIframe() {
    jqShow(document.querySelector(".iframe_loader"));
    jqHide(document.getElementById("iframeContent"));

    const iframeContent = document.getElementById("iframeContent");
    iframeContent.innerHTML = `
      <iframe
        allow="web-share; payment"
        id="anywhere-fancy-box-iframe"
        frameborder="0"
        hspace="0"
        scrolling="auto"
        src="${bookingPageLink}">
      </iframe>
    `;

    document.getElementById("anywhere-fancy-box-iframe").onload =
      initialFrameLoad;
  }

  function positionPopup() {
    const popup = document.getElementById("anywhere-fancy-box");
    const overlay = document.getElementById("anywhere-overlay");

    overlay.style.height = `${document.documentElement.scrollHeight}px`;

    const popupHeight = window.innerHeight - 100;
    popup.style.marginLeft = `-${popup.offsetWidth / 2}px`;
    popup.style.marginTop = `${
      (window.innerHeight - popupHeight) / 2 + window.scrollY
    }px`;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function hidePopup() {
    jqHide(document.getElementById("anywhere-overlay"));
    jqHide(document.getElementById("anywhere-fancy-box"));

    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }

  function showPopup() {
    jqShow(document.getElementById("anywhere-overlay"));
    jqShow(document.getElementById("anywhere-fancy-box"));
  }

  document.addEventListener("click", (evt) => {
    const target = evt.target;
    if (
      target.closest("#anywhere-overlay") ||
      target.closest("#anywhere-fancy-box-close-icon")
    ) {
      hidePopup();
    }
  });

  if (!isBookingPageLoaded) {
    isBookingPageLoaded = true;
    renderTemplate();
  } else {
    loadIframe();
    positionPopup();
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

    // if (!parsed.hostname.endsWith("anywhere.com")) {
    //   const invalidPath = parsed.pathname + parsed.search;
    //   bookingPageLink =
    //     "https://booking.anywhere.com" + (invalidPath || "/invalidurl");
    // }

    anywherePopup(e, bookingPageLink);
  });
});
