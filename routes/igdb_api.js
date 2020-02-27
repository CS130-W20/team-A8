const express = require('express');
const winston = require('winston');
const axios = require('axios');
const genres = require('./constants/genres');
const router = express.Router();
const igdb_helpers = require('./helpers/igdb_helper');

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
 * @returns {Array.<Object>} - List of JSON objects representing popular games
 */
router.get('/popular', async (req, res) => {
	const { limit } = req.query;
	let result = {};
	try {
		result = await igdb_helpers.getGames(null, limit);
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
 * @returns {Array.<Object>} - List of JSON objects representing popular games in genre
 */
router.get('/searchByGenre', async (req,res) => {
	const { genre, limit } = req.query;
	url = baseUrl + 'genres/';
	const genreId = genres[genre.toLowerCase()];
	try {
		let result = await igdb_helpers.getGames(genreId, limit);
		res.status(200).send(result);
	} catch (err) {
		res.status(400).send('Error');
	}
});

/**
 * Searches for a games. Returns name and cover picture 
 * @param {string} title - title to search for
 * @returns {Array.<Object>} - List of relevant games based on search parameter
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
			promises.push(igdb_helpers.getCover(res.cover));
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
		let coverUrl = await igdb_helpers.coverCover(id, resolution);
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
					promises.push(igdb_helpers.getGameDetail(key, subId));
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

module.exports = router;