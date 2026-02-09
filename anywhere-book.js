(function () {
	let popupOverlay = null;
	let iframeLoaded = false;

	const CLOSE_ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M1.3335 0.674316L10.6668 10.0076" stroke="#EFF3F9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.6668 0.674316L1.3335 10.0076" stroke="#EFF3F9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

	const CENTER_ICON_DEFAULT = `
	<svg
	aria-hidden="true"
	fill-rule="evenodd"
	preserveAspectRatio="xMidYMid meet"
	viewBox="0 0 480 480"
	xmlns="http://www.w3.org/2000/svg"
	style="
		width: 20px;
		height: 20px;
		fill: #111111;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	"
	>
	<path d="m302.262 181.997-46.391-8.29a3.314 3.314 0 0 1-3.314-3.316v-6.633c0-1.658 0-3.316 3.314-3.316 28.166 3.316 59.646 3.316 62.96-14.923 1.657-16.581-33.137-24.871-57.99-31.503h-6.627a3.319 3.319 0 0 1-3.314-3.316V97.435c0-1.658 0-3.316 3.314-3.316 13.255-1.658 24.853-4.975 31.48-9.949 13.255-11.606-19.882-44.768-46.391-43.11-26.51 1.658-62.96 33.162-49.705 46.426 3.313 4.975 16.568 6.633 33.136 8.29 3.314 0 4.971 0 4.971 3.317v8.29s-1.657 3.317-4.971 3.317c-16.568 0-33.136 1.658-46.391 8.29-6.627 3.316-21.539 13.265-16.568 24.871 6.627 11.607 36.45 3.316 62.959 9.949l3.314 3.316v11.606l-3.314 3.317c-29.823 0-66.273 6.632-74.557 24.871-6.628 16.581 8.284 33.161 36.45 29.845l36.45-4.974c1.657 0 3.314 1.658 3.314 4.974v9.949c0 1.658 0 3.316-3.314 3.316-16.568 0-29.823 4.974-39.764 9.949-23.195 11.606-14.911 38.135 9.941 33.161l28.167-3.316c1.656 0 3.313 0 3.313 3.316l-1.657 152.544c0 1.658 0 3.316 3.314 3.316h29.823l3.314-3.316-3.314-152.544c0-3.316 1.657-4.974 3.314-4.974l24.852 3.316c28.167 4.974 38.108-24.871 9.941-34.82-9.941-3.316-21.538-6.632-34.793-6.632a3.317 3.317 0 0 1-3.314-3.316v-13.265c0-1.658 0-3.316 3.314-3.316h1.657c24.852 0 66.273 9.948 72.9-6.632 6.628-16.581-11.597-26.53-28.166-33.162l-1.657 1.658z"/>
	</svg>
	`;

	const CENTER_ICON_SETMORE = `
	<svg
	aria-hidden="true"
	data-eds-component="true"
	fill-rule="evenodd"
	focusable="false"
	preserveAspectRatio="xMidYMid meet"
	role="img"
	viewBox="0 0 480 480"
	xmlns="http://www.w3.org/2000/svg"
	style="
		width: 20px;
		height: 20px;
		fill: #111111;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	"
	>
	<path d="M210.833 216.666h-.583c0 64.948-38.039 140-116.084 140v-64.167c96.084.056 116.667-69.133 116.667-110.833V100h-.583c0 64.948-38.039 140-116.084 140v-64.167C190.25 175.889 210.834 106.7 210.834 65h58.334c0 41.7 20.582 110.889 116.666 110.833V240c-78.044 0-116.083-75.052-116.083-140h-.583v81.666c0 41.7 20.582 110.889 116.666 110.833v64.167c-78.044 0-116.083-75.052-116.083-140h-.583v198.333h-58.334V216.666z"/>
	</svg>
	`;

	const SPINNING_CIRCLE = `
	<svg
	viewBox="0 0 50 50"
	xmlns="http://www.w3.org/2000/svg"
	style="
		width: 50px;
		height: 50px;
		animation: anywhereSpin 1s linear infinite;
	"
	>
	<circle
		cx="25"
		cy="25"
		r="20"
		fill="none"
		stroke="#111111"
		stroke-width="1"
		stroke-linecap="round"
		stroke-dasharray="90"
		stroke-dashoffset="60"
	/>
	</svg>
	`;

	function createPopup(bookingPageLink) {
		const overlay = document.createElement('div');
		overlay.className = 'anywhere-overlay';
		overlay.style.display = 'none';

		const box = document.createElement('div');
		box.className = 'anywhere-box';

		const closeBtn = document.createElement('div');
		closeBtn.className = 'anywhere-close';
		closeBtn.innerHTML = CLOSE_ICON_SVG;

		const loader = document.createElement('div');
		loader.className = 'anywhere-loader';

		// Only the center icon changes based on brand
		const centerIcon = bookingPageLink.includes('setmore')
			? CENTER_ICON_SETMORE
			: CENTER_ICON_DEFAULT;
		loader.innerHTML = `
            <div style="position: relative; width: 50px; height: 50px;">
                ${centerIcon}    <!-- changes for Setmore -->
                ${SPINNING_CIRCLE} <!-- same spinning circle for all brands -->
            </div>
        `;

		const iframe = document.createElement('iframe');
		iframe.className = 'anywhere-iframe';
		iframe.src = bookingPageLink;

		iframe.onload = () => {
			iframeLoaded = true;
			loader.style.display = 'none';
			iframe.style.display = 'block';
		};

		function hidePopup() {
			overlay.style.display = 'none';
		}

		closeBtn.addEventListener('click', hidePopup);
		overlay.addEventListener('click', (e) => {
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

		popupOverlay.style.display = 'flex';
	}

	document.addEventListener('DOMContentLoaded', () => {
		const brands = ['serviceforge', 'setmore'];
		const anyWhereButton = document.querySelector('.anywhere-book-now-button');
		let brand = 'setmore'; // default brand
		if (anyWhereButton) {
			document.body.classList.add('anywhere-active');
			const bookingUrl = anyWhereButton.dataset.bookingUrl;
			try {
				const hostname = new URL(bookingUrl).hostname;
				brand = brands.find((brandName) => hostname.includes(brandName)) || 'setmore';
			} catch {
				brand = 'setmore';
			}
		}
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = `https://assets.${brand}.com/integration/book-now/live/v1/anywhere-book-now.css`;
		document.head.appendChild(link);

		const triggers = document.querySelectorAll('.anywhere-book-now-button');
		triggers.forEach((trigger) => {
			if (trigger) {
				const bookingPageLink = trigger?.dataset?.bookingUrl;
				const newTabAttr = trigger?.dataset?.newTab === 'true'; // convert to boolean

				trigger.addEventListener('click', () => {
					const windowWidth = window.innerWidth;

					if (newTabAttr || windowWidth < 600) {
						// Open in a new tab if data-new-tab=true OR small screen

						window.open(bookingPageLink, '_blank', 'noopener');
						return;
					}
					openPopup(bookingPageLink);
				});
			}
		});
	});
})();
