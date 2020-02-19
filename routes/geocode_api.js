const express = require('express');
const winston = require('winston');
const User = require('../models/User');
const router = express.Router();

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});


router.get('/geocode', async(req,res) => {

    const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    let { address } = req.query;
    address = address.replace(/ +/g, "+");
    console.log(address)
});

module.exports = router;