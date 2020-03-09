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
	const userId = req.user ? req.user._id : '5e65afa04f3f0246e8e01740'; // hard coded for testing
	const userInfo = { _id: userId, favorites: { id: id}};
	userInfo.favorites.operation = (inc == 'true') ? "add" : "remove";
	const errUser = await User.updateUser(userInfo);
	const errGame = (inc == 'true') ? await Game.IncrementLike(id, true) : await Game.IncrementLike(id, false);
	return (errUser || errGame) ? res.status(400).send('Failed to change likes or add to user favorites') : res.status(200).send('Successfully changed likes');
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

/**
 * Add host to a game in our db
 */
router.post('/addHost', async (req, res) => {
	logger.info('Adding host to game');
	const { id, userId } = req.query;
	const err = await Game.AddHost(id, userId);
	return err ? res.status(400).send('Failed to add host') : res.status(200).send('Successfully added host');
});

/**
 * Remove host from game in our db
 */
router.post('/removeHost', async (req, res) => {
	logger.info('Removing host from game');
	const { id, userId } = req.query;
	const err = await Game.RemoveHost(id, userId);
	return err ? res.status(400).send('Failed to remove host') : res.status(200).send('Successfully removed host');
});

module.exports = router;