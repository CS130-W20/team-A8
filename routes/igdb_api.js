const express = require('express');
const winston = require('winston');
const axios = require('axios');
const router = express.Router();

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

const baseUrl = 'https://api-v3.igdb.com/'
const headers = { 'user-key': global.gConfig.igdb_key }

/**
* Grabs most popular games. 
* param(limit) - limit the amount of results
**/
router.get('/popular', async (req, res) => {
	const { limit } = req.query;
	url = baseUrl + 'games/';
	data = 'fields name, cover; sort popularity desc;' 
	data = limit ? `${data} limit ${limit};` : data;
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		logger.info('successfully got popular games');
		res.status(200).send(result.data);
	} catch (err) {
		logger.error('error getting popular games');
		res.status(400).send('Error')
	}
});

/**
* Searches for a games. Returns name and cover picture 
* param(title) - title to search for
**/
router.get('/search', async (req, res) => {
	const { title } = req.query;
	url = baseUrl + 'games/';
	data = `search "${ title }"; fields name, cover;`;
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		logger.info('successfully searched');
		res.status(200).send(result.data);
	} catch (err) {
		console.log(err);
		logger.error('error searching');
		res.status(400).send('Error');
	}
})

/**
* Finds the cover picture for a game. Returns a URL to the image
* param(resolution) - the resolution of the picture. Options: 720p, 1080p. Defaults to 720p. lmk if you need more resolutions.
* param(id) - the id of the game
**/
router.get('/cover', async (req, res) => {
	let { id, resolution } = req.query;
	if (resolution == null) {
		resolution = '720p';
	}
	url = baseUrl + 'covers';
	data = `fields url; where id = ${id};`;
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		logger.info('found cover');
		const regex = /t_thumb/;
		coverUrl = result.data[0].url.replace(regex, `t_${resolution}`).substring(2);
		res.status(200).send(coverUrl);
	} catch (err) {
		console.log(err.data);
		res.status(400).send('Error')
	}
})

module.exports = router;