const express = require('express');
const winston = require('winston');
const axios = require('axios');
const User = require('../models/User');
const router = express.Router();

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});


router.get('/geocode', async(req,res) => {

    let geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    let { address, api_key } = req.query;
    address = address.replace(/ +/g, "+");
    geocodeUrl += `address=${address}&key=${api_key}`;
    try {
        let result = await axios.get(geocodeUrl);
        logger.info("successfully received geocoordinates");
        let geocoordinates = result.data.results[0].geometry.location
        console.log(geocoordinates);
		res.status(200).send(geocoordinates);
	} catch (err) {
		console.log(err);
		logger.error('Error getting geocoordinates');
		res.status(400).send('Error');
	} 
});

module.exports = router;