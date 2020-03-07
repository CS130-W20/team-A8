const express = require('express');
const Game = require('../models/User');
const User = require('../models/User');
const Chat = require('../models/ChatHistory');
const router = express.Router();
const winston = require('winston');
const messaging_helper = require('./helpers/messaging_helper');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

/**
 * Main inbox page for each user
 */
router.get('/inbox', async (req, res) => {
   logger.info('getting list of chat partners');
   const userId = req.user ? req.user._id : global.gConfig.test_id;
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
   logger.info('connecting to socketIO');
   let io = req.app.get('io');
   const userId = req.user ? req.user._id : global.gConfig.test_id;
   try {
      result = await messaging_helper.connect(io, userId);
      res.status(200).send(result);
   } catch (err) {
      logger.error('Error connecting to socketio');
      res.status(400).send('Error');
   }
});

/**
 * Endpoint to get the chat history. It expects the partner's id as well as your own from the request
 * It sends the list of messages previously sent
 * @param {string} id - id of the chat partner
 * @param {string} userId - id of current user
 * @returns {Array.<String>} - list of previous chat messages
 */
router.get('/getChatHistory', async (req, res) => {
   logger.info('getting chat history');
   const { id } = req.query;
   const userId = req.user ? req.user._id : global.gConfig.test_id;
   try {
      logger.info('found or creating chat history');
      let result = await messaging_helper.getChatHistory(userId, id);
      res.status(200).send(result);
   } catch (err) {
      logger.error('error getting chat history');
      res.status(400).send(err);
   }
});

router.post('/addToChatHistory', async (req, res) => {
   logger.info('adding to chat history');
   const message = {
      userID1: req.body.userID1,
      userID2: req.body.userID2,
      text: req.body.message
   };
   try {
      logger.info('found message');
      await Chat.updateChat(message);
      res.status(200).send('All good');
   } catch (err) {
      logger.error('error getting message');
      res.status(400).send(err);
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