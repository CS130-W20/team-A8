
var socketID = null;
var this_io = null;
var this_socket = null;

/**
 * Connects when user accesses inbox
 * @param {<Object>} io - io object is the overarching object used for socketio
 */
function connect(io) {
   this_io = io;
   io.on('connection', onConnect);
   return "Successfully connected to SocketIO";
}

/**
 * This function just deals with the main connection
 * @param {<Object>} socket - socket object used to communicate with others
 */
function onConnect(socket) {
   this_socket = socket;
   // socket.on('send message', privateMessage(usr, msg));
};

/**
 * Updates the user's database with their new socket id
 * @param {Integer} user - holdes the user's socket id
 */
function updateUserSocket(user) {
   if (user) {
      user.socket = socketID;
      user.save(function(err) {
         if (err) console.log(err);
         console.log("Successfully updated");
      });
   }
};

/**
 * Private message event sends msg to new user
 * @param {Integer} usr - holds the user's socket id
 * @param {String} msg - holds the message the user typed and received
 */
function privateMessage(usr, msg) {
   console.log(msg + "to" + usr);
   this_io.to(usr).emit('private message', msg);
}

module.export = {connect, onConnect, updateUserSocket, privateMessage};