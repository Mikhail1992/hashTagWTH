import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.js';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';

import 'leaflet.heat/dist/leaflet-heat.js';

import './css/app.less';

import { consumeTemplates, instantiateTemplate } from './dom/templates.js';
import { binding as domBinding } from './dom/binding.js';

onDomReady(function() {
	let map = L.map('map').setView([53.8906642, 27.535885], 15);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	consumeTemplates({ domId: 'templates', module: 'main' });

	let cardsContainerEl = document.querySelector('.x-main-root .x-panel > .cards-container');

	(async function() {
		let response = await fetch('http://localhost:3000/locations.json');
		let locations = await response.json();

		var markers = L.markerClusterGroup();

		locations.forEach(function(opts) {
			let {lat, lon, img, url, date} = opts;
			let markerOptions = {};

			if (img) {
				markerOptions.icon = L.icon({
					iconUrl: img,
					iconSize: [32, 32],
					iconAnchor: [16, 16],
					popupAnchor: [0, -18],
				});
			}

			let marker = L.marker(new L.LatLng(lat, lon), markerOptions);

			marker.__hashTagData = opts;

			if (img) {
				let html = '<div class="x-post-popup">';

				if (url) html += '<a href="' + url + '" target="_blank">';

				html += '<img src="' + img + '">';

				if (url) html += '</a>';

				html += '</div>';

				marker.bindPopup(html);
			}

			markers.addLayer(marker);
		});

		map.addLayer(markers);

		markers.on('clusterclick', cluster => {
			let arr = cluster.layer.getAllChildMarkers().map(x => x.__hashTagData);

			arr = arr.slice(0, 100);

			cardsContainerEl.innerHTML = '';

			arr.sort((a, b) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
            }).forEach(function({ img, url, text, hashtags }) {
				let cardEl = instantiateTemplate('main', 'post_card');

				let binding = domBinding(cardEl, {
					photo: img,
					text: text,
					url: url
				});

				if (Array.isArray(hashtags) && hashtags.length) {
					let isFirst = true;

					hashtags.forEach(x => {
						let el = document.createElement('span');
						el.textContent = '#' + x;

						binding.hashtagsEl.appendChild(el);

						if (isFirst) isFirst = false;
						else binding.hashtagsEl.appendChild(document.createTextNode(' '));
					});
				} else {
					binding.hashtagsEl.style.display = 'none';
				}

				//binding.photoEl.style.backgroundImage = 'url("' + img + '")';

				cardsContainerEl.appendChild(cardEl);
			});

			cardsContainerEl.scrollTop = 0;
		});

		let heatPoints = [];

		locations.forEach(function({lat, lon}) {
			heatPoints.push([lat, lon, 0.5]);
		});

		let heat = L.heatLayer(heatPoints, {radius: 20});

		heat.addTo(map);
	})();
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
