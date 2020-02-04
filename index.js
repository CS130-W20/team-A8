// Express variable
var express = require('express');
var app = express();
var http = require('http').createServer(app);

// Mongoose and facebook auth variables
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

// Socket io
var io = require('socket.io')(http);

process.env.NODE_ENV = 'development';
const config = require('./config/config.js');


//mongoose connection
mongoose.connect(global.gConfig.mongo_url, ({ dbName: global.gConfig.db }, { useNewUrlParser: true }));
let db = mongoose.connection;
mongoose.Promise = global.Promise;
db.once('open', () => { console.log('Successfully connected');});
db.on('error', console.error.bind(console, 'conn error:'));

app.use(passport.initialize());
app.use(passport.session());

let authRouter = express.Router();
require('./routes/passport')(passport);
require('./routes/auth')(authRouter, passport);

app.use('/auth', authRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, res) {
   res.sendFile(__dirname + '/chat.html');
});

//auth
/*
const options = {											// Used for certificate for HTTPS
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt')
};

https
	.createServer(app)
	.listen(global.gConfig.port, function() {
		console.log(`listening on port ${global.gConfig.port}`);
});
*/

// Socket io connection logic
io.on('connection', function(socket) {
   console.log('successfully connected to socket.io!');
   console.log(socket.id);
   socket.on('chat message', function(msg) {
      io.emit('chat message', msg);
   });
});

http.listen(3000, function() {
   console.log('listening on *:3000');
});