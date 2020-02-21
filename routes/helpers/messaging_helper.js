const User = require('../../models/User');
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
      await io.on('connection', onConnect);
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
async function onConnect(socket) {
   let user;
   try {
      user = await User.findById(userId);
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
   // socket.on('send message', privateMessage(usr, msg));
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
function privateMessage(usr, msg) {
   console.log(msg + "to" + usr);
   this_io.to(usr).emit('private message', msg);
}

module.export = {connect, onConnect, updateUserSocket, privateMessage};