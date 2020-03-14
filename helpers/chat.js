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

         // Get socket
         let user;
         try {
            user = await User.findById(msg_info.user2);
         } catch (err) {
            logger.error(`Error finding user: ${err}`);
         }
         if (!user) {
            logger.error('User non existent');
         }

         let me;
         try {
            me = await User.findById(msg_info.user1);
         } catch (err) {
            logger.error(`Error finding user: ${err}`);
         }
         if (!me) {
            logger.error('User non existent');
         }
         if (me.socket !== msg_info.socket2) {
            await User.updateUser({
               _id: msg_info.user1,
               socket: msg_info.socket2
            })
         }

         console.log(`user is: ${user}`)
         let socket = user.socket;
         console.log(`Target socket = ${socket}, my socket = ${me.socket}, sent socket = ${msg_info.socket2}`);
         io_.to(socket).emit('RECEIVE_MESSAGE', msg_info);
      }
   
      // Public method
      return {
         // On connect function for socketIO
         onConnect: async function (socket) {
            console.log('in onConnect');

            // Set socket
            socket_ = socket.id;

            console.log("Checking what's currently loaded");
            console.log(userId_);
            console.log(socket_);

            // Update user if necessary
            this.updateSocketID();

            // Await socket message
            socket.on('SEND_MESSAGE', onReceiveMessage);
         },

         // Update database
         updateSocketID: async function () {
            console.log('Updating socket id');
            let user;
            try {
               user = await User.findById(userId_);
            } catch (err) {
               logger.error(`Error is: ${err}`);
            }
            if (!user) {
               logger.error('Could not find user');
            }
            const userInfo = {
               _id: userId_,
               socket: socket_
            };
            await User.updateUser(userInfo);
         },

         // Set id
         setUserID: async function (id) {
            console.log('Updating user id');
            userId_ = id;
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