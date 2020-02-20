const express = require('express');
const winston = require('winston');
const axios = require('axios');
const genres = require('./constants/genres');
const router = express.Router();

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

const baseUrl = 'https://api-v3.igdb.com/';
const headers = { 'user-key': global.gConfig.igdb_key };


/**
 * Grabs most popular games
 * @param {string} limit - limit the amount of results
 * @returns {[object]} - List of JSON objects representing popular games
 */
router.get('/popular', async (req, res) => {
	const { limit } = req.query;
	let result = {};
	try {
		result = await getGames(null, limit);
		res.status(200).send(result);
	} catch (err) {
		logger.error('error getting popular games');
		res.status(400).send(err);
	}
});

/**
 * Grabs most popular games by genre
 * @param {string} genre - genre search parameter
 * @param {string} limit - limit the amount of results
 * @returns {[object]} - List of JSON objects representing popular games in genre
 */
router.get('/searchByGenre', async (req,res) => {
	const { genre, limit } = req.query;
	url = baseUrl + 'genres/';
	const genreId = genres[genre.toLowerCase()];
	try {
		let result = await getGames(genreId, limit);
		res.status(200).send(result);
	} catch (err) {
		res.status(400).send('Error');
	}
});

/**
 * Searches for a games. Returns name and cover picture 
 * @param {string} title - title to search for
 * @returns {[object]} - List of relevant games based on search parameter
 */
router.get('/search', async (req, res) => {
	const { title } = req.query;
	let url = baseUrl + 'games/';
	let data = `search "${ title }"; fields name, cover;`;
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
});

/**
 * Finds the cover picture for a game. Returns a URL to the image
 * @param {string} resolution - the resolution of the picture. Options: 720p, 1080p. Defaults to 720p. lmk if you need more resolutions.
 * @param {string} id - the id of the game
 * @returns {string} - URL for the cover image of the relevant game
 */
router.get('/cover', async (req, res) => {
	let { id, resolution } = req.query;
	try {
		let coverUrl = await getCover(id, resolution);
		res.status(200).send(coverUrl);
	} catch (err) {
		console.log(err.data);
		res.status(400).send('Error');
	}
});

/**
 * Gets all the relevant details needed for the game page
 * @param {string} id - the id of the game
 * @returns {object} - Game details
 */
router.get('/game', async (req,res) => {
	const acceptedKeys = [ 'age_ratings', 'genres', 'involved_companies', 'platforms', 'screenshots'];
	let { id } = req.query;
	let url = baseUrl + 'games';
	let data = `fields age_ratings , aggregated_rating, 
			first_release_date, platforms, genres, 
			rating, rating_count, total_rating, total_rating_count,
			name, url, screenshots; where id = ${id};`;

	
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		let promises = [];
		for(const key in result.data[0]){
			if (acceptedKeys.includes(key)){
				logger.info(key);
				for(const subId of result.data[0][key]){
					promises.push(getGameDetail(key, subId));
				}
				result.data[0][key] = [];
			}
		}
		promises = await Promise.all(promises);
		for(const obj of promises){
			result.data[0][obj.key].push(obj.data);
		}
		logger.info('found game');
		res.status(200).send(result.data[0]);
		
	} catch (err) {
		console.log(err);
		logger.error('error getting game details');
		res.status(400).send('Error');
	}
});

/**
 * Helper function to get games. By default gets most popular 10 games
 * Otherwise can specify the number of games to return and a genre (more extendable as well)
 * @param {string} genre - name of genre to be used to search for games
 * @param {string} limit - number of games to be returned
 * @returns {[object]} - List of game objects 
 */
async function getGames(genre, limit) {
	url = baseUrl + 'games/';
	data = 'fields name, cover, total_rating, total_rating_count, genres; sort popularity desc;' 
	data = genre ? `${data} where genres = ${genre};` : `${data} where genres != 13;`;
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
		logger.info('successfully got games');
		return result.data;
	} catch (err) {
		logger.error('error getting games');
		return err;
	}
}

/**
 * Helper function to get the cover URL of a given game ID
 * @param {*} id - id of the game
 * @param {*} resolution  - resolution of the picture. Options: 720p, 1080p.
 * @returns {string} - URL for cover image
 */
async function getCover(id, resolution){
	resolution = resolution || '720p';
	let url = baseUrl + 'covers';
	let data = `fields url; where game = ${id};`;
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		logger.info('found cover');
		const regex = /t_thumb/;
		coverUrl = result.data[0].url.replace(regex, `t_${resolution}`).substring(2);
		logger.info(coverUrl);
		return coverUrl;
	} catch (err) {
		console.log(err);
	}
}

/**
 * Returns an object containing all the fields for a specific detail about the game
 * @param {string} key - determines what information we are trying to pull from igdb API (i.e. age_ratings, genres)
 * @param {int} id - the id of the given key (i.e. genre id for genres key)
 * @returns {object} - Game details
 */
async function getGameDetail(key, id){
	let url = baseUrl + key;
	let data = `fields *; where id = ${id};`;
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		logger.info(`found ${key}`);
		return { 'key': key, 'data': result.data};
	} catch (err) {
		console.log(err);
	}
}

function replaceThumbnail(url) {
	const regex = /t_thumb/;
	coverUrl = result.data[0].url.replace(regex, `t_720p`).substring(2);
}

module.exports = router;