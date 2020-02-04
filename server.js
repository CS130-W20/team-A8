var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
   res.sendFile(__dirname + 'index/html');
});

server.listen(3000);