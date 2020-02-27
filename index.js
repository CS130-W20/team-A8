const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const passport = require('passport');

process.env.NODE_ENV = 'development';
const config = require('./config/config.js');

// Set messaging
app.set('io', io);

//mongoose connection
mongoose.connect(global.gConfig.mongo_url, ({ dbName: global.gConfig.db }, { useNewUrlParser: true }));
let db = mongoose.connection;
mongoose.Promise = global.Promise;
db.once('open', () => { console.log('Successfully connected');});
db.on('error', console.error.bind(console, 'conn error:'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

let authRouter = express.Router();
require('./routes/passport')(passport);
require('./routes/auth')(authRouter, passport);
const igdbRouter = require('./routes/igdb_api');
const profileRouter = require('./routes/profile_api');
const gamesRouter = require('./routes/games_api');
const messagingRouter = require('./routes/messaging_api');

app.use('/auth', authRouter);
app.use('/igdb', igdbRouter);
app.use('/profile', profileRouter);
app.use('/games', gamesRouter);
app.use('/messaging', messagingRouter);

app.get('/home', (req, res) => {
	console.log('here1');
    console.log(req.user);
});

http.listen(9000, function(){
	console.log('listening on *:9000');
});