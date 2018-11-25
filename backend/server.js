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

	await cursor.forEach(function(doc) {
		if (!doc) return;
		if (!doc.url) return;

		let lat = parseFloat(doc.lat),
		    lon = parseFloat(doc.lon);

		if (!isFinite(lat) || !isFinite(lon)) return;

		let obj = {
			lat: lat,
			lon: lon,
			img: doc.url
		};

		if (doc.shortcode) {
			obj.url = 'https://www.instagram.com/p/' + doc.shortcode;
		}

		locations.push(obj);
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