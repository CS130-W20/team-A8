// Socket io
var http = require('../index.js');
var io = require('socket.io')(http);

// Socket io connection logic
module.exports.listen = () => {
   console.log('hello world');
   io.on('connection', function(socket) {
      console.log('successfully connected to socket.io!');
      console.log(socket.id);
      socket.on('chat message', function(msg) {
         io.emit('chat message', msg);
      });
   });
}