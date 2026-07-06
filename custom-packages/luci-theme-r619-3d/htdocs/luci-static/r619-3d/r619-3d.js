(function() {
	'use strict';

	const reduceMotion = window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function createCanvas() {
		if (document.getElementById('r619-3d-grid'))
			return;

		const canvas = document.createElement('canvas');
		canvas.id = 'r619-3d-grid';
		canvas.setAttribute('aria-hidden', 'true');
		document.body.prepend(canvas);

		const ctx = canvas.getContext('2d');
		let width = 0;
		let height = 0;
		let frame = 0;

		function resize() {
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.max(1, Math.floor(width * ratio));
			canvas.height = Math.max(1, Math.floor(height * ratio));
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		}

		function draw() {
			ctx.clearRect(0, 0, width, height);

			const horizon = height * 0.38;
			const offset = reduceMotion ? 0 : (frame % 80);

			ctx.save();
			ctx.globalAlpha = 0.58;
			ctx.strokeStyle = 'rgba(64, 230, 178, 0.22)';
			ctx.lineWidth = 1;

			for (let i = 0; i < 22; i++) {
				const y = horizon + Math.pow(i / 21, 1.85) * height * 0.72 + offset * 0.28;
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}

			const center = width * 0.5;
			for (let i = -16; i <= 16; i++) {
				const x = center + i * 54;
				ctx.beginPath();
				ctx.moveTo(center, horizon);
				ctx.lineTo(x, height);
				ctx.stroke();
			}

			ctx.strokeStyle = 'rgba(246, 179, 74, 0.32)';
			ctx.beginPath();
			ctx.moveTo(0, horizon);
			ctx.lineTo(width, horizon);
			ctx.stroke();
			ctx.restore();

			frame++;
			if (!reduceMotion)
				window.requestAnimationFrame(draw);
		}

		window.addEventListener('resize', resize, { passive: true });
		resize();
		draw();
	}

	function markActiveCards() {
		if (document.getElementById('view') && !document.getElementById('maincontent'))
			document.body.classList.add('sysauth');

		const title = document.querySelector('h2, h3, .cbi-map > h2');
		if (title)
			title.setAttribute('data-r619-title', '');

		document.querySelectorAll('.cbi-section, .table, .ifacebox, .alert-message, .modal')
			.forEach((node) => node.classList.add('r619-panel'));
	}

	function wireMenuDepth() {
		document.querySelectorAll('#topmenu > li > a, #modemenu > li > a')
			.forEach((link) => {
				link.addEventListener('pointermove', function(ev) {
					const rect = this.getBoundingClientRect();
					const x = ((ev.clientX - rect.left) / rect.width - 0.5).toFixed(3);
					const y = ((ev.clientY - rect.top) / rect.height - 0.5).toFixed(3);
					this.style.setProperty('--r619-mx', x);
					this.style.setProperty('--r619-my', y);
				}, { passive: true });

				link.addEventListener('pointerleave', function() {
					this.style.removeProperty('--r619-mx');
					this.style.removeProperty('--r619-my');
				}, { passive: true });
			});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			createCanvas();
			markActiveCards();
			wireMenuDepth();
		});
	} else {
		createCanvas();
		markActiveCards();
		wireMenuDepth();
	}
})();
