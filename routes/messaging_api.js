const express = require('express');
const Game = require('../models/User');
const User = require('../models/User');
const Chat = require('../models/ChatHistory');
const router = express.Router();
const winston = require('winston');
const messaging_helper = require('./helpers/messaging_helper');
const ChatIO = require('../helpers/chat');
var chat = ChatIO.Chat.getInstance(null);

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

/**
 * Main inbox page for each user
 * @api {get} /messaging/inbox - get's the current users chat partners to display them
 * @apiParam {[String]} id - user id of the current user
 * @apiDescription Returns formatted list of chat partners, with their id and first name
 */
router.get('/inbox', async (req, res) => {
   logger.info('getting list of chat partners');
   const userId = req.user ? req.user._id : global.gConfig.test_id;
   await chat.setUserID(userId);
   await chat.updateSocketID();
   let user;
   try {
      user = await User.findById(userId);
      console.log('user is: ');
      console.log(user);
   } catch (err) {
      logger.error('got an error finding user');
      res.status(400).sendDate(err);
   }
   if (!user) {
      return res.status(400).send('Could not find user (before chat parnters)');
   }

   logger.info('getting result array');
   const resArr = user.chatPartners.map(async elem => {
      let u;
      try {
         console.log(elem);
         u = await User.findById(elem);
      } catch (err) {
         logger.error('error finding user');
         res.status(400).sendDate(err);
      }
      if (!u) {
         return res.status(400).send('Could not find user (after chat partners)');
      }
      const userInfo = {
         id: elem,
         name: u.firstName
      };
      return userInfo;
   });

   const users = await Promise.all(resArr);
   console.log(users);

   // Await the populate function
   res.status(200).send(users);
});

/**
 * Endpoint to get the chat history. It expects the partner's id as well as your own from the request
 * @api {get} /messaging/getChatHistory - It sends the list of messages previously sent
 * @apiParam {string} id - id of the chat partner
 * @apiDescription - returns list of previous chat messages
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


/**
 * @api {get} /messaging/addChatPartner - add a chat partner to the current user
 * @apiParam {String} id - mongo id of the partner current user wishes to chat with
 * @apiDescription - Returns success upon updating current users chat partner with new chat partner
 */
router.get('/addChatPartner', async (req, res) => {
   logger.info('adding this profile as chat partner');
   const { id } = req.query;
   const userId = req.user ? req.user._id : global.gConfig.test_id;
   try {
      logger.info('adding this partner to list');
      console.log(id);
      const userInfo1 = {
         _id: userId,
         chatPartners: {
            id: id,
            operation: 'add'
         }
      }
      await User.updateUser(userInfo1);

      const userInfo2 = {
         _id: id,
         chatPartners: {
            id: userId,
            operation: 'add'
         }
      }
      await User.updateUser(userInfo2);

      console.log('successfully updated chat partner?');
      res.status(200).send('Successfully added chat partner');
   } catch (err) {
      logger.error('error adding chat partner');
      res.status(400).send(err);
   }
})

/**
 * @api {post} /messaging/addToChatHistory - Updates user's chat history with new message
 * @apiParam {String, String, String} message - formatted message that contains current user id, chat partner id and message
 * @apiDescription (i.e. { "message": { "userID1": 198hf017y28a, "userID2": AIUF9109u4AH, "message": "hello" } })
 */
router.post('/addToChatHistory', async (req, res) => {
   logger.info('adding to chat history');
   const message = {
      userID1: req.body.userID1,
      userID2: req.body.userID2,
      text: req.body.message
   };
   try {
      logger.info('found message');
      console.log(message);
      await Chat.updateChat(message);
      res.status(200).send('All good');
   } catch (err) {
      logger.error('error getting message');
      res.status(400).send(err);
   }
});

module.exports = router;