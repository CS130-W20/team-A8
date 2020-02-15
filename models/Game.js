const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var GameSchema = new mongoose.Schema({
	id: {
		type: Number,
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
 * @param {Integer} id the ID of the game
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
		const gameInfo = { id, likes: 1 };
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

module.exports = Game = mongoose.model('Game', GameSchema);