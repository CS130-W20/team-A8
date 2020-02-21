const express = require('express');
const Game = require('../models/User');
const router = express.Router();
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var socketID = null;
var this_io = null;
var this_socket = null;

// Socket io connection logic
function connect(io) {
   this_io = io;
   io.on('connection', onConnect);
   return "Successfully connected to SocketIO";
}

function onConnect(socket) {
   this_socket = socket;
   // socket.on('private message', privateMessage(usr, msg));
};

function updateDatabase(user) {
   if (user) {
      user.socket = socketID;
      user.save(function(err) {
         if (err) console.log(err);
         console.log("Successfully updated");
      });
   }
};

function privateMessage(usr, msg) {
   console.log(msg + "to" + usr);
   this_io.to(usr).emit('private message', msg);
}

/**
 * Connects user to socketio to allow them to communicate with other people
 */
router.get('/connectSocketIO', async (req, res) => {
   let io = req.app.get('io');
   try {
      result = await connect(io);
      res.status(200).send(result);
   } catch (err) {
      logger.error('Error connecting to socketio');
      res.status(400).send('Error');
   }
});

/**
 * Send private message to person you clicked on
 */
// Need to work on this once backend developed
// router.get('/privateMessage', async (req, res) => {
//    let partner_id = req.socketID;
//    this_socket.on('private message', function(msg) {
//       this_io.to(partner_id).emit('private message', msg);
//    });
// });

module.exports = router;