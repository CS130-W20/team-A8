const express = require('express');
const winston = require('winston');
const Game = require('../models/Game');
const router = express.Router();

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

/**
 * Increments or decrements the number of likes that a game has. 
 * query string inc=true/false to either increment or decrement.
 * query string id for the game id.
 */
router.post('/IncOrDecLikes', async (req, res) => {
	logger.info('Incrementing or decrementing number of likes');
	const { id, inc } = req.query;
	const err = (inc == 'true') ? await Game.IncrementLike(id, true) : await Game.IncrementLike(id, false);
	return err ? res.status(400).send('Failed to change likes') : res.status(200).send('Successfully changed likes');
});

/**
 * Gets game information.
 * query string id for the game id.
 */
router.get('/getGameInfo', async (req, res) => {
	logger.info('Finding Host');
	const { id } = req.query;
	const game = await Game.findOne({ id });
	return game ? res.status(200).send(game) : res.status(400).send('Game does not exist in db');
});

module.exports = router;