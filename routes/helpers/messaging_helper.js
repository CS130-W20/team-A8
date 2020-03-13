const User = require('../../models/User');
const Chat = require('../../models/ChatHistory');
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

/**
 * Helper function to get the chat history from the chat database
 * User ids can be interchangeable
 * 
 * @param {string} user1 - current user's id
 * @param {string} user2 - partner's id
 * @return {Array.<string>} - List of previous chat messages
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

module.exports = {getChatHistory};