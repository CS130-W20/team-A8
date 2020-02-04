const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

var UserSchema = new mongoose.Schema({
	gameTitle: {
		type: String,
		required: true,
	},
	
});