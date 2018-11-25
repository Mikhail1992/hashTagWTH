import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.js';

import './css/app.less';

import { consumeTemplates, instantiateTemplate } from './dom/templates.js';

onDomReady(function() {
	let map = L.map('map').setView([53.9, 27.555], 12);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	consumeTemplates({ domId: 'templates', module: 'main' });

	let cardsContainerEl = document.querySelector('.x-main-root .x-panel > .cards-container');

	for (let i = 0; i < 5; i++) {
		let cardEl = instantiateTemplate('main', 'post_card');

		cardsContainerEl.appendChild(cardEl);
	}
});

function onDomReady(fun, options) {
	var isCalled = false;

	if (document.readyState === 'complete' || (options && options.allowInteractive && document.readyState === 'interactive')) {
		fun();
	} else {
		document.addEventListener('readystatechange', checkLoad);
		document.addEventListener('DOMContentLoaded', checkLoad);
	}

	function checkLoad() {
		if (isCalled) return;

		if (document.readyState === 'complete' || (options && options.allowInteractive && document.readyState === 'interactive')) {
			isCalled = true;
			fun();
		}
	}
};
