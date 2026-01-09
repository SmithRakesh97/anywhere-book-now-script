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
  el.style.display = 'none';
}

function jqShow(el) {
  const prev = displayCache.get(el);
  el.style.display = prev && prev !== 'none' ? prev : 'block';
}

/* ---- iframe load handler ---- */
function initialFrameLoad() {
  document.querySelectorAll('.iframe_loader').forEach(jqHide);
  jqShow(document.getElementById('iframeContent'));

  const fancyBox = document.getElementById('anywhere-fancy-box');
  const content = document.getElementById('anywhere-fancy-box-content');

  const iframeWindowHeight = window.innerHeight;
  const fancyBoxHeight = fancyBox.offsetHeight;

  content.style.height =
    iframeWindowHeight > fancyBoxHeight
      ? '635px'
      : `${iframeWindowHeight - 50}px`;
}

/* ---- main popup ---- */
function anywherePopup(e, bookingPageLink) {
  e.preventDefault();
  e.stopPropagation();
  if (e.stopImmediatePropagation) e.stopImmediatePropagation();

  if (window.innerWidth < 600) {
    window.open(bookingPageLink, '_blank');
    return;
  }

  const overlayHTML = `<div id="anywhere-overlay"></div>`;
  const popupHTML = `
    <div id="anywhere-fancy-box"
      style="background:#fff;height:auto;left:50%;position:absolute;top:0;width:545px;z-index:9999;">
      <button id="anywhere-fancy-box-close-icon"></button>
      <div id="anywhere-fancy-box-content">
        <div class="int-loader-wrap iframe_loader"></div>
        <div id="iframeContent" style="height:100%;width:100%"></div>
      </div>
    </div>
  `;

  function renderTemplate() {
    document.body.insertAdjacentHTML('beforeend', overlayHTML + popupHTML);
    positionPopup();
    loadIframe();
  }

  function loadIframe() {
    jqShow(document.querySelector('.iframe_loader'));
    jqHide(document.getElementById('iframeContent'));

    const iframeContent = document.getElementById('iframeContent');
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

    document.getElementById('anywhere-fancy-box-iframe').onload =
      initialFrameLoad;
  }

  function positionPopup() {
    const popup = document.getElementById('anywhere-fancy-box');
    const overlay = document.getElementById('anywhere-overlay');

    overlay.style.height =
      `${document.documentElement.scrollHeight}px`;

    const popupHeight = window.innerHeight - 100;
    popup.style.marginLeft = `-${popup.offsetWidth / 2}px`;
    popup.style.marginTop =
      `${(window.innerHeight - popupHeight) / 2 + window.scrollY}px`;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    jqHide(document.getElementById('anywhere-overlay'));
    jqHide(document.getElementById('anywhere-fancy-box'));

    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }

  function showPopup() {
    jqShow(document.getElementById('anywhere-overlay'));
    jqShow(document.getElementById('anywhere-fancy-box'));
  }

  document.addEventListener('click', evt => {
    const target = evt.target;
    if (
      target.closest('#anywhere-overlay') ||
      target.closest('#anywhere-fancy-box-close-icon')
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
document.addEventListener('DOMContentLoaded', () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://assets.setmore.com/integration/websiteBooking/css/setmorePopupLive.css';
  document.head.appendChild(link);

  document.addEventListener('click', e => {
    const anchor = e.target.closest('#Anywhere_button_iframe');
    if (!anchor) return;

    let bookingPageLink = anchor.href;
    const parsed = new URL(bookingPageLink);

    if (!parsed.hostname.endsWith('anywhere.com')) {
      const invalidPath = parsed.pathname + parsed.search;
      bookingPageLink =
        'https://booking.anywhere.com' +
        (invalidPath || '/invalidurl');
    }

    anywherePopup(e, bookingPageLink);
  });
});
