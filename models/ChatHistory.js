const mongoose = require('mongoose');
const winston = require('winston');
const User = require('./User');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var ChatHistorySchema = new mongoose.Schema({
   userID1: {
      type: String,
      required: true,
   },
   userID2: {
      type: String,
      required: true,
   },
   history: {
      type: [String],
      required: false,
   }
});

ChatHistorySchema.statics.inDatabase = async (user1, user2) => {
   logger.info('checking in database');
   let chat1, chat2;
   chat1 = await ChatHistory.findOne({ userID1: user1, userID2: user2 }).exec();
   chat2 = await ChatHistory.findOne({ userID1: user2, userID2: user1 }).exec();
   if (chat1) {
      return chat1;
   }
   if (chat2) {
      return chat2;
   }
   return null;
}

ChatHistorySchema.statics.findOrCreate = async (userInfo) => {
   logger.info('Chat history findOrCreate');
   let user1, user2;
   let chat;
   try {
      user1 = await User.findById(userInfo.userID1);
      // console.log(user1);
      user2 = await User.findById(userInfo.userID2);
      // console.log(user2);
   } catch (err) {
      console.log(err);
      logger.error('find user error');
      return err;
   }
   chat = await ChatHistory.inDatabase(user1._id, user2._id);
   if (!chat) {
      logger.info('No chat. Creating one');
      try {
         chat = await ChatHistory.create(userInfo);
         console.log(chat);
      } catch (err) {
         logger.error('failed to create chat');
         return err;
      }
   }
   return chat;
}

ChatHistorySchema.statics.updateChat = async (updateInfo) => {
   logger.info('updateChat');
   let chat;
   try {
      chat = await ChatHistory.inDatabase(updateInfo.userID1, updateInfo.userID2);
      console.log(chat);
   } catch (err) {
      console.log(err);
      logger.error('chat update error');
      return err;
   }
   if (!chat) {
      logger.error('No chat to update');
      return 'No chat to update'
   }
   try {
      chat['history'].push(updateInfo['history']);
   } catch (err) {
      console.log(err);
      logger.error('failed to update chat');
      return err;
   }
   return;
}

module.exports = ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);