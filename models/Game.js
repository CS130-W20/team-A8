const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var GameSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	likes: {
		type: Number,
		required: true,
	},
	hosts: {
		type: [ String ],
		default: [],
	}
});

/**
 * This is used to increment/decrement the number of likes/saves that the game has.
 * If the game doesn't exist in the db, it adds an entry.
 * @param {string} id the ID of the game
 * @param {Bool} inc True to increment, False to decrement 
 */
GameSchema.statics.IncrementLike = async (id, inc) => {
	logger.info('increment likes');
	let game;
	try {
		game = await Game.findOne({ id });
	} catch (err) {
		logger.error('Error finding game');
		return 'Error finding game';
	}
	if (!game) {
		const gameInfo = { id, likes: 1, hosts: [] };
		await Game.create(gameInfo);
		return;
	}
	try {
		const likes = inc ? game.likes + 1 : game.likes - 1;
		if (likes < 0) {
			logger.error('Cannot have less than 0 likes');
			throw new Error('Cannot have less than 0 likes');
		}
		const gameInfo = { id, likes };
		await Game.update(gameInfo);
	} catch (err) {
		logger.error('failed to update likes');
		return 'Failed to update likes';
	}
	return;
};

/**
 * Adds a user ID to a given game's hosts array
 * @param {string} gameId the ID of the game
 * @param {string} userId the ID of the user
 */
GameSchema.statics.AddHost = async (gameId, userId) => {
	logger.info('add host');
	let game;
	try {
		game = await Game.findOne({id: gameId});
	} catch (err) {
		logger.error('Error finding game');
		return 'Error finding game';
	}
	if (!game) {
		const gameInfo = { id: gameId, likes: 0, hosts: [userId] };
		await Game.create(gameInfo);
		return;
	}
	try {
		let newHosts = game.hosts;
		newHosts.push(userId);
		const gameInfo = { "id": gameId, "hosts": newHosts};
		await Game.update(gameInfo);
	} catch (err) {
		logger.error('failed to update hosts');
		return 'Failed to update hosts'
	}
}
module.exports = Game = mongoose.model('Game', GameSchema);