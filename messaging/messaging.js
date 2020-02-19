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
   // Use mongodb id instead of first name and last name
   let han = User.findOne({'firstName': 'Han'}, 'firstName lastName socket', function(err, person) {
      if (err) console.log(err);
      socketID = person.socket;
      person.save(function(err) {
         if (err) console.log(err);
      });
   });
   // socket.on('chat message', function(msg) {
   //    this_io.to(`${socketID}`).emit('chat message', msg);
   // });
   socket.on('private message', privateMessage(usr, msg));
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

function privateMessage(usr, msg) {
   console.log(msg + "to" + usr);
   this_io.to(usr).emit('private message', msg);
}

module.exports = {
   connect,
   updateDatabase
};