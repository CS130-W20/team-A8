const express = require('express');
const Game = require('../models/User');
const User = require('../models/User');
const router = express.Router();
const winston = require('winston');
const messaging_helper = require('./helpers/messaging_helper');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

router.get('/inbox', async (req, res) => {
   logger.info('getting list of chat partners');
   const userId = req.user ? req.user._id : global.gConfig.port.test_id;
   let user;
   try {
      user = await User.findById(userId);
   } catch (err) {
      logger.error('got an error finding user');
      res.status(400).sendDate(err);
   }
   if (!user) {
      return res.status(400).send('Could not find user');
   }
   const userInfo = {
      chatPartners: user.chatPartners,
   };
   res.status(200).send(userInfo);
});

/**
 * Connects user to socketio to allow them to communicate with other people
 * @param {<Object>} io - the io object from index.js needed to connect
 * @returns {string} - result of the connection 
 */
router.get('/connectSocketIO', async (req, res) => {
   let io = req.app.get('io');
   const userId = req.user ? req.user._id : global.gConfig.port.test_id;
   try {
      result = await messaging_helper.connect(io, userId);
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