const axios = require('axios');
const winston = require('winston');
const igdb_key = require('../../config/config.json').development.igdb_key;
const genresToIds = require('../constants/genres');

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
 * @param {[string]} genres - array of genre names to be used to search for games
 * @param {string} limit - number of games to be returned
 * @returns {Array.<Object>} - List of game objects 
 */
async function getGames(genres, limit) {
	url = baseUrl + 'games/';
	data = 'fields name, cover, total_rating, total_rating_count, genres; sort popularity desc;' 
	if (genres && genres.length==1) {
		data = genres ? `${data} where themes != (42) & genres = ${genres[0]};` : data;
	} else if (genres && genres.length>1) {
		let genreString = "where themes != (42) & genres = (";
		for(const genreId of genres) {
			genreString += `${genreId},`;
		}
		genreString = genreString.slice(0,-1);
		genreString += ");";
		data += genreString;
	} else {
		data += 'where themes != (42);';
	}
	data = limit ? `${data} limit ${limit};` : data;
	console.log(data)
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
 * Helper function to get the cover URL of a given cover ID
 * @param {string} id - id of the cover
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
		const returnError = new Error('Error getting cover');
        return returnError;
	}
}

/**
 * Another helper function to get the cover URL of a given game ID
 * @param {string} id - id of the game
 * @param {string} resolution  - resolution of the picture. Options: 720p, 1080p.
 * @returns {string} - URL for cover image
 */
async function coverCover(id, resolution){
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
        return err;
	}
}

/**
 * Helper function for recommended game route. 
 * Algorithm to recommend games based on weighted averages & randomization to choose 2 genres user often interacts with to get popular games from
 * @param {Object} genres Object mapping genre names to the user's viewcounts of each type of game
 * @param {string} limit Number of games to be returned
 */
async function getRecommendedGames(genres, limit) {
	let genreCount = []
	for(let genreName in genres) {
		const views = genres[genreName];
		if(Number.isInteger(views))
			genreCount.push([views, genreName]);
	}
	genreCount.sort(function(a, b) {
		return b[0] - a[0];
	})

	let randomize1 = Math.floor(Math.random() * 100);
	let randomize2 = Math.floor(Math.random() * 100);

	let selectedGenreIndex1 = (randomize1 < 30 ? 0 : (randomize1 < 55 ? 1 : (randomize1 < 75 ? 2 : (randomize1 < 90 ? 3 : 4))))
	let selectedGenreIndex2 = (randomize2 < 30 ? 0 : (randomize2 < 55 ? 1 : (randomize2 < 75 ? 2 : (randomize2 < 90 ? 3 : 4))))
	if (selectedGenreIndex1 == selectedGenreIndex2) {
		selectedGenreIndex2 += 1
	}
	const recommendedGenres = [genresToIds[genreCount[selectedGenreIndex1][1]], genresToIds[genreCount[selectedGenreIndex2][1]]];
	console.log(recommendedGenres)
	let recommendedGames = await getGames(recommendedGenres, limit);
	return recommendedGames;
}

module.exports = { getGames, getCover, coverCover, getGameDetail, getRecommendedGames}