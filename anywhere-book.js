(function () {
  let popupOverlay = null;
  let iframeLoaded = false;

  const CLOSE_ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M1.3335 0.674316L10.6668 10.0076" stroke="#EFF3F9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.6668 0.674316L1.3335 10.0076" stroke="#EFF3F9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const LOADER_SVG = `
  <div style="
    position: relative;
    width: 50px;
    height: 50px;
  ">
    <!-- Center Icon -->
    <svg aria-hidden="true"
      fill-rule="evenodd"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      style="
        height:20px;
        width:20px;
        fill:#111111;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
      ">
      <path d="M210.833 216.666h-.583c0 64.948-38.039 140-116.084 140v-64.167c96.084.056 116.667-69.133 116.667-110.833V100h-.583c0 64.948-38.039 140-116.084 140v-64.167C190.25 175.889 210.834 106.7 210.834 65h58.334c0 41.7 20.582 110.889 116.666 110.833V240c-78.044 0-116.083-75.052-116.083-140h-.583v81.666c0 41.7 20.582 110.889 116.666 110.833v64.167c-78.044 0-116.083-75.052-116.083-140h-.583v198.333h-58.334V216.666z"></path>
    </svg>

    <!-- Spinning Circle -->
    <svg
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      style="
        width:50px;
        height:50px;
        animation: anywhereSpin 1s linear infinite;
      ">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#111111"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray="90"
        stroke-dashoffset="60"
      />
    </svg>
  </div>
`;

  function createPopup(bookingPageLink) {
    const overlay = document.createElement("div");
    overlay.className = "anywhere-overlay";
    overlay.style.display = "none";

    const box = document.createElement("div");
    box.className = "anywhere-box";

    const closeBtn = document.createElement("div");
    closeBtn.className = "anywhere-close";
    closeBtn.innerHTML = CLOSE_ICON_SVG;

    const loader = document.createElement("div");
    loader.className = "anywhere-loader";
    loader.innerHTML = LOADER_SVG;

    const iframe = document.createElement("iframe");
    iframe.className = "anywhere-iframe";
    iframe.src = bookingPageLink;

    iframe.onload = () => {
      iframeLoaded = true;
      loader.style.display = "none";
      iframe.style.display = "block";
    };

    function hidePopup() {
      overlay.style.display = "none";
    }

    closeBtn.addEventListener("click", hidePopup);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hidePopup();
    });

    box.appendChild(closeBtn);
    box.appendChild(loader);
    box.appendChild(iframe);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    return overlay;
  }

  function openPopup(bookingPageLink) {
    if (!popupOverlay) {
      popupOverlay = createPopup(bookingPageLink);
    }

    popupOverlay.style.display = "flex";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://smithrakesh97.github.io/anywhere-book-now-css/anywhere-book-now.css";
    document.head.appendChild(link);

    const trigger = document.getElementById("Anywhere_button_iframe");

    if (trigger) {
      const bookingPageLink = trigger.dataset.bookingUrl;;

      trigger.addEventListener("click", () => {
        const windowWidth = window.innerWidth;

        if (windowWidth < 600) {
          window.open(bookingPageLink, "_blank", "noopener");
          return;
        }
        openPopup(bookingPageLink);
      });
    }
  });
})();
