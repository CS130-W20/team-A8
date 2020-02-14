const User = require('../models/User');

var socketID = null;
var this_io = null;

// Socket io connection logic
function connect(io) {
   this_io = io;
   io.on('connection', onConnect);
}

function onConnect(socket) {
   console.log(socket.id);
   // socketID = socket.id;
   let han = User.findOne({'firstName': 'Han'}, 'firstName lastName socket', function(err, person) {
      if (err) console.log(err);
      socketID = person.socket;
      person.save(function(err) {
         if (err) console.log(err);
      });
   });
   socket.on('chat message', function(msg) {
      this_io.to(`${socketID}`).emit('chat message', msg);
   });
};

function updateDatabase(user) {
   if (user) {
      user.socket = socketID;
      user.save(function(err) {
         if (err) console.log(err);
         console.log("Successfully updated");
      });
   }

   // Also update luke and han for testing purposes
   let han = User.findOne({'firstName' : 'Han'}, 'firstName lastName socket', function(err, person) {
      if (err) console.log('Error finding han: %s', err);
      person.socket = socketID;
      person.save(function(err) {
         if (err) console.log(err);
         console.log("Successfully updated han");
      });
      console.log(person);
   });
};

module.exports = {
   connect,
   updateDatabase
};