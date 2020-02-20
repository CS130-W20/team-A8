const axios = require('axios');
const winston = require('winston');
const igdb_key = require('../../config/config.json').development.igdb_key;

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

const baseUrl = 'https://api-v3.igdb.com/';
const headers = { 'user-key': igdb_key };

/**
 * Helper function to get games. By default gets most popular 10 games
 * Otherwise can specify the number of games to return and a genre (more extendable as well)
 * @param {string} genre - name of genre to be used to search for games
 * @param {string} limit - number of games to be returned
 * @returns {Array.<Object>} - List of game objects 
 */
async function getGames(genre, limit) {
	url = baseUrl + 'games/';
	data = 'fields name, cover, total_rating, total_rating_count, genres; sort popularity desc; where themes != (42);' 
	data = genre ? `${data} where genres = ${genre};` : data;
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
 * @param {string} id - id of the game
 * @param {string} resolution  - resolution of the picture. Options: 720p, 1080p.
 * @returns {string} - URL for cover image
 */
async function getCover(id, resolution){
	resolution = resolution || '720p';
	let url = baseUrl + 'covers';
	let data = `fields url; where id = ${id};`;
	try {
		let result = await axios.get(url, {
			headers,
			data,
		});
		const regex = /t_thumb/;
		coverUrl = result.data[0].url.replace(regex, `t_${resolution}`).substring(2);
		return coverUrl;
	} catch (err) {
        return err
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
        return err;
	}
}

module.exports = { getGames, getCover, getGameDetail}