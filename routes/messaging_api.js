const express = require('express');
const Game = require('../models/User');
const router = express.Router();
const winston = require('winston');
const messaging_helper = require('./helpers/messaging_helper');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

/**
 * Connects user to socketio to allow them to communicate with other people
 */
router.get('/connectSocketIO', async (req, res) => {
   let io = req.app.get('io');
   try {
      result = await messaging_helper.connect(io);
      res.status(200).send(result);
   } catch (err) {
      logger.error('Error connecting to socketio');
      res.status(400).send('Error');
   }
});

/**
 * Send private message to person you clicked on
 */
// Need to work on this once backend developed
// router.get('/privateMessage', async (req, res) => {
//    let partner_id = req.socketID;
//    this_socket.on('private message', function(msg) {
//       this_io.to(partner_id).emit('private message', msg);
//    });
// });

module.exports = router;