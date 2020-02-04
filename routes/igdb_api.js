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
 * Grabs most popular games
 * @param {int} limit - limit the amount of results
 */
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
		let promises = [];
		for (let res of result.data){
			promises.push(getCover(res.cover));
		}
		promises = await Promise.all(promises);
		for (let resIndex in result.data){
			result.data[resIndex].coverUrl = promises[resIndex];
		}
		logger.info('successfully got popular games');
		res.status(200).send(result.data);
	} catch (err) {
		logger.error('error getting popular games');
		res.status(400).send('Error')
	}
});

/**
 * Searches for a games. Returns name and cover picture 
 * @param {string} title - title to search for
 */
router.get('/search', async (req, res) => {
	const { title } = req.query;
	url = baseUrl + 'games/';
	data = `search "${ title }"; fields name, cover;`;
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		let promises = [];
		for (let res of result.data){
			promises.push(getCover(res.cover));
		}
		promises = await Promise.all(promises);
		for (let resIndex in result.data){
			result.data[resIndex].coverUrl = promises[resIndex];
		}
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
 * @param {string} resolution - the resolution of the picture. Options: 720p, 1080p. Defaults to 720p. lmk if you need more resolutions.
 * @param {string} id - the id of the game
 */
router.get('/cover', async (req, res) => {
	let { id, resolution } = req.query;
	try {
		coverUrl = await getCover(id, resolution);
		res.status(200).send(coverUrl);
	} catch (err) {
		console.log(err.data);
		res.status(400).send('Error')
	}
})

/**
 * Helper function to get the cover URL of a given game ID
 * @param {*} id - id of the game
 * @param {*} resolution  - resolution of the picture. Options: 720p, 1080p.
 */
async function getCover(id, resolution){
	resolution = resolution || '720p';
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
		logger.info(coverUrl)
		return coverUrl
	} catch (err) {
		console.log(err);
	}
};

module.exports = router;