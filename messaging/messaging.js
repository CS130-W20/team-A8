const User = require('../models/User');

// Socket io connection logic
module.exports = function(io) {
   io.on('connection', onConnect); //{
      /*
      socket.on('chat message', function(msg) {
         io.emit('chat message', msg);
         console.log('chat message triggered');
      });
      */
      /*
      socket.join('chat room', () => {
         let rooms = Object.keys(socket.rooms);
         console.log(rooms);
      });
      */
   //});
   // Set mongo to moongoose
   // var user = User.findOne();
   // console.log(user);
}

function onConnect(socket) {
   console.log('hello');
   User.find(function (err, users) {
      if (err) return console.log(err);
      console.log(users);
   });
};