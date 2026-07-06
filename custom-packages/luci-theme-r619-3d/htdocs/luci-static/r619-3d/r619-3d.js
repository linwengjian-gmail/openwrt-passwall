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

	function createLoginFx() {
		if (!document.body.classList.contains('sysauth') || document.getElementById('codex-login-fx'))
			return;

		const canvas = document.createElement('canvas');
		canvas.id = 'codex-login-fx';
		canvas.setAttribute('aria-hidden', 'true');
		document.body.prepend(canvas);

		const hud = document.createElement('div');
		hud.className = 'codex-hud';
		hud.setAttribute('aria-hidden', 'true');
		hud.innerHTML = '<span>AUTH MATRIX</span><span>UBUS LINK</span><span>SESSION VECTOR</span><span>LEDE NODE</span>';
		document.body.appendChild(hud);

		const ctx = canvas.getContext('2d');
		let width = 0;
		let height = 0;
		let ratio = 1;
		let frame = 0;
		let nodes = [];
		let packets = [];

		function resize() {
			ratio = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.max(1, Math.floor(width * ratio));
			canvas.height = Math.max(1, Math.floor(height * ratio));
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

			const count = Math.max(44, Math.min(92, Math.floor(width * height / 19000)));
			nodes = Array.from({ length: count }, (_, i) => ({
				x: (i * 97 % 1000) / 1000 * width,
				y: (i * 193 % 1000) / 1000 * height,
				vx: (((i * 29) % 17) - 8) * 0.018,
				vy: (((i * 41) % 19) - 9) * 0.018,
				r: 1.2 + (i % 4) * 0.45
			}));
			packets = Array.from({ length: 18 }, (_, i) => ({
				a: i % count,
				b: (i * 7 + 11) % count,
				t: (i * 0.137) % 1,
				s: 0.003 + (i % 5) * 0.0008
			}));
		}

		function ring(cx, cy, radius, alpha, color) {
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.strokeStyle = color.replace('ALPHA', alpha.toFixed(3));
			ctx.lineWidth = 1;
			ctx.stroke();
		}

		function draw() {
			ctx.clearRect(0, 0, width, height);

			const cx = width * 0.5;
			const cy = height * 0.48;
			const pulse = reduceMotion ? 0 : Math.sin(frame * 0.018);

			ctx.save();
			ctx.globalCompositeOperation = 'lighter';
			ring(cx, cy, 130 + pulse * 12, 0.18, 'rgba(37, 240, 166, ALPHA)');
			ring(cx, cy, 210 - pulse * 8, 0.12, 'rgba(78, 148, 255, ALPHA)');
			ring(cx, cy, 292 + pulse * 16, 0.08, 'rgba(240, 180, 79, ALPHA)');

			for (const n of nodes) {
				n.x += n.vx;
				n.y += n.vy;
				if (n.x < -20) n.x = width + 20;
				if (n.x > width + 20) n.x = -20;
				if (n.y < -20) n.y = height + 20;
				if (n.y > height + 20) n.y = -20;
			}

			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				for (let j = i + 1; j < nodes.length; j++) {
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 132) {
						const alpha = (1 - dist / 132) * 0.2;
						ctx.strokeStyle = 'rgba(37, 240, 166, ' + alpha.toFixed(3) + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
						ctx.stroke();
					}
				}
			}

			for (const n of nodes) {
				ctx.fillStyle = 'rgba(111, 255, 207, 0.66)';
				ctx.beginPath();
				ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
				ctx.fill();
			}

			for (const p of packets) {
				const a = nodes[p.a];
				const b = nodes[p.b];
				p.t = (p.t + p.s) % 1;
				const x = a.x + (b.x - a.x) * p.t;
				const y = a.y + (b.y - a.y) * p.t;
				ctx.fillStyle = 'rgba(240, 180, 79, 0.9)';
				ctx.beginPath();
				ctx.arc(x, y, 2.4, 0, Math.PI * 2);
				ctx.fill();
			}
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
			createLoginFx();
			wireMenuDepth();
		});
	} else {
		createCanvas();
		markActiveCards();
		createLoginFx();
		wireMenuDepth();
	}
})();
