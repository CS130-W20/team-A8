const User = require('../models/User');
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var Chat = (function () {
   // Public fields
   var instance_;
   var io_;
   var socket_;
   var userId_;

   function createInstance(IO) {
      // Set io to whatever is passed on the other side
      io_ = IO;

      // Private method
      async function onReceiveMessage(msg_info) {
         console.log('GOT SEND_MESSAGE REQUEST');
         console.log(msg_info);
         io_.to(msg_info.user).emit('RECEIVE_MESSAGE', msg_info);
      }
   
      // Public method
      return {
         // On connect function for socketIO
         onConnect: async function (socket) {
            console.log('in onConnect');

            // Set socket
            socket_ = socket.id;

            // Update user if necessary
            this.updateSocketID(userId_);

            // Await socket message
            socket.on('SEND_MESSAGE', onReceiveMessage);
         },

         // Update database
         updateSocketID: async function (id) {
            console.log('Updating socket id');
            userId_ = id;
            let user;
            try {
               user = await User.findById(id);
            } catch (err) {
               logger.error(`Error is: ${err}`);
            }
            if (!user) {
               logger.error('Could not find user');
            }
            const userInfo = {
               _id: id,
               socket: socket_
            };
            await User.updateUser(userInfo);
         }
      };
   }

   return {
      getInstance: function (IO) {
         if (!instance_) {
            instance_ = createInstance(IO);
         }
         return instance_;
      }
   };
})();

module.exports.Chat = Chat;