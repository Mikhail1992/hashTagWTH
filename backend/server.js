const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

let locations = null;

(async function() {
	// Connection URL
	const url = process.env.MONGODB_URI;
	// Database Name
	const dbName = 'hashtagwth';
	const client = new MongoClient(url, {
		useNewUrlParser: true
	});

	try {
		// Use connect method to connect to the Server
		await client.connect();

		const db = client.db(dbName);

		await onConnected({db});

		console.log('started at port 3000');

		app.get('/locations.json', (req, res) => {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(locations));
		});
	} catch (err) {
		console.log(err.stack);
	}

	client.close();
})();

app.listen(3000);

async function onConnected({db}) {
	locations = [];

	await processInstagram({db, locations});
	//await processTwitter({db, locations});
}

async function processInstagram({db, locations}) {
	let instagramCollection = db.collection('instPosts');
	
	let cursor = instagramCollection.find({
		//date: { $gt: '2018-11-23T20:50:29Z' }
	}).sort({ date: -1 });

	let total = await cursor.count();

	console.log('total', total);

	let index = 0;
	let lastIndex = 0;

	await cursor.forEach(function(doc) {
		index++;

		if (!doc) return;
		if (!doc.url) return;

		let lat = parseFloat(doc.lat),
		    lon = parseFloat(doc.lon);

		if (!isFinite(lat) || !isFinite(lon)) return;

		let hashtags = parseHashTags(doc.text);

		if (!Array.isArray(hashtags)) return;

		let obj = {
			lat: lat,
			lon: lon,
			img: doc.url,
			text: doc.text,
			hashtags: hashtags
		};

		if (doc.shortcode) {
			obj.url = 'https://www.instagram.com/p/' + doc.shortcode;
		}

		locations.push(obj);

		if (index - lastIndex >= 100) {
			lastIndex = index;
			console.log('processing', index);
		}
	});
}

async function processTwitter({db, locations}) {
	let collection = db.collection('posts');
	
	let cursor = collection.find({
		//date: { $gt: '2018-11-23T20:50:29Z' }
	}).sort({ date: -1 });

	await cursor.forEach(function(doc) {
		if (!doc) return;

		let lat = parseFloat(doc.lat),
		    lon = parseFloat(doc.lon);

		if (!isFinite(lat) || !isFinite(lon)) return;

		locations.push({
			lat: lat,
			lon: lon
		});
	});
}

function isBadHashTag(tag) {
	tag = tag.toLowerCase();

	switch (tag) {
	case 'новаяколлекция':
	case 'обувьженская':
	case 'скидки':
	case 'гелиевыешарыминск':
	case 'вдобрыеруки':
	case 'маникюрминск':
	case 'маникюр':
	case 'тцзеркало':
	case 'салонкрасоты':
	case 'ресницы':
	case 'окраскастрижкаминск':
	case 'укладкаволос':
	case 'букетминск':
	case 'минскназаказ':
	case 'хлопокминск':
	case 'постельноебелье':
	case 'скидкиминск':
	case 'уггиминск':
	case 'минскшоппинг':
	case 'заказминск':
	case 'животныеминск':
	case 'подаркиминск':
	case 'подарочныйнабор':
	case 'одеждаминск':
	case 'маскидлясна':
	case 'макияж':
	case 'джинсыминск':
	case 'ногтиминск':
	case 'женскаяодежда':
	case 'женскаяобувь':
	case 'украшенияминск':
	case 'бровиминск':
	case 'белорусскиедизайнеры':
	case 'модаминск':
	case 'nemiga3':
	case 'немига3':
	case 'shopping':
	case 'секондминск':
	case 'topfashioninnaвналичии':
	case 'курткаминск':
	case 'пеньюар':
	case 'репетиторминск':
	case 'minskmodel':
	case 'линзыбеларусь':
	case 'немигаминск':
	case 'тцнемига3':
	case 'моднаяодежда':
		return true;
		break;
	default:
		return false;
	}
}

function parseHashTags(text) {
	let regexp = /#([^\s#]+)/g;

	let result = [];

	let match;
	while (match = regexp.exec(text)) {
		let tag = match[1];

		if (isBadHashTag(tag)) return null;

		result.push(tag);
	}

	return result;
}