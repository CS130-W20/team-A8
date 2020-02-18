const express = require('express');
const winston = require('winston');
const MapsClient = require("@googlemaps/google-maps-services-js").Client;
const User = require('../models/User');
const router = express.Router();
const map = new MapsClient({});

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});



module.exports = router;