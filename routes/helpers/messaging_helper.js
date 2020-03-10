const User = require('../../models/User');
const Chat = require('../../models/ChatHistory');
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var socketID = null;
var this_io = null;
var this_socket = null;
let userId;

/**
 * Connects when user accesses inbox
 * @param {<Object>} io - io object is the overarching object used for socketio
 * @return {string} - returns successful or unsuccessful connection
 */
async function connect(io, id) {
   this_io = io;
   userId = id;
   try {
      console.log('about to connect to io');
      io.on('connection', onConnect);
      return "Successfully connected to SocketIO";
   } catch (err) {
      logger.error('Error connecting');
      return err;
   }
}

/**
 * This function just deals with the main connection
 * @param {<Object>} socket - socket object used to communicate with others
 * @returns {void} - does not return anything
 */
function onConnect(socket) {
   console.log('in onConnect');
   let user;
   try {
      user = User.findById(userId);
   } catch (err) {
      logger.error(err);
   }
   if (!user) {
      logger.error('Error finding user');
   }
   const userInfo = {
      _id: userId,
      socket: socket.id
   };
   User.updateUser(userInfo);
   socket.on('SEND_MESSAGE', privateMessage);
};

/**
 * Updates the user's database with their new socket id
 * @param {integer} user - holdes the user's socket id
 * @return {integer} - returns the user back to the caller
 */
function updateUserSocket(user) {
   if (user) {
      user.socket = socketID;
      user.save(function(err) {
         if (err) console.log(err);
         console.log("Successfully updated");
      });
   }
   return user;
};

/**
 * Private message event sends msg to new user
 * @param {Integer} usr - holds the user's socket id
 * @param {String} msg - holds the message the user typed and received
 * @returns {void} - does not return anything
 */
async function privateMessage(msg_info) {
   // Update chat partners
   /*
   let user;
   try {
      user = await User.findById(userId);
   } catch (err) {
      logger.error(err);
   }
   if (!user) {
      logger.error('error findind user');
   }
   const userInfo = {
      _id: userId,
      chatPartners: usr,
   };
   User.updateUser(userInfo);

   console.log(msg + "to" + usr);
   */
   console.log('Got SEND_MESSAGE request');
   console.log(msg_info);
   this_io.to(msg_info.user).emit('RECEIVE_MESSAGE', msg_info.message);
}

/**
 * Helper function to get the chat history from the chat database
 * User ids can be interchangeable
 * 
 * @param {String} user1 - current user's id
 * @param {String} user2 - partner's id
 * @return {Array.<String>} - List of previous chat messages
 */
async function getChatHistory(user1, user2) {
   let chat;
   const userInfo = {
      userID1: user1,
      userID2: user2,
   };
   try {
      chat = await Chat.findOrCreate(userInfo);
   } catch (err) {
      logger.error('error finding chat');
      console.log(err);
      return [""];
   }
   if (!chat) {
      logger.error('error finding chat');
      return [""];
   }
   console.log(chat);
   console.log('chat history: ' + chat['history']);
   return chat['history'];
}

module.exports = {connect, onConnect, updateUserSocket, privateMessage, getChatHistory};