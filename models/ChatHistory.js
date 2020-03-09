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
      type: [mongoose.Schema.Types.Mixed],
      required: false,
   }
});

ChatHistorySchema.statics.inDatabase = async (user1, user2) => {
   logger.info('checking in database');
   let chat1, chat2;
   console.log(user1);
   console.log(user2);
   chat1 = await ChatHistory.findOne({ userID1: user1, userID2: user2 }).exec();
   chat2 = await ChatHistory.findOne({ userID1: user2, userID2: user1 }).exec();
   console.log(chat1);
   console.log(chat2);
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
   console.log(userInfo);
   let user, user1, user2;
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
   if (!user1 || !user2) {
      logger.error('Did not find one or both of the users');
      return 'Error';
   }
   chat = await ChatHistory.inDatabase(user1._id, user2._id);
   if (!chat) {
      logger.info('No chat. Creating one');
      try {
         chat = await ChatHistory.create(userInfo);
         console.log(chat);
         
         // Add to my chat partner
         const usrInfo1 = {
            _id: userInfo.userID1,
            chatPartners: {
               id: userInfo.userID2,
               operation: 'add'
            }
         }
         await User.updateUser(usrInfo1);

         // Add myself to partner's chat partner
         const usrInfo2 = {
            _id: userInfo.userID2,
            chatPartners: {
               id: userInfo.userID1,
               operation: 'add'
            }
         }
         await User.updateUser(usrInfo2);
      } catch (err) {
         logger.error('failed to create chat');
         return err;
      }
   }
   return chat;
}

ChatHistorySchema.statics.updateChat = async (updateInfo) => {
   logger.info('updateChat');
   console.log(updateInfo);
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
      console.log(updateInfo['text']);
      chat['history'].push(updateInfo['text']);
   } catch (err) {
      console.log(err);
      logger.error('failed to update chat');
      return err;
   }
   chat.save(function(err) {
      if (err) console.log(err);
      else console.log("Successfully updated");
   });
   return;
}

module.exports = ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);