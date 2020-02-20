const axios = require('axios');
const winston = require('winston');
const api_key = require('../config/config.json').development.api_key;
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

/**
 * Converts an address to its corresponding geocoordinates using google maps API
 * @param {string} address - user's address
 * @returns {object} - latitude and longitude
 */
async function addressToGeocoordinates(address) {
    let geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    address = address.replace(/ +/g, "+");
    geocodeUrl += `address=${address}&key=${api_key}`;
    try {
        let result = await axios.get(geocodeUrl);
        logger.info("successfully received result");
        if (result.data.results.length==0) {
            return 'No results for address';
        }
        let geocoordinates = result.data.results[0].geometry.location
        console.log(geocoordinates);
        return geocoordinates
        
	} catch (err) {
		console.log(err);
		logger.error('Error getting geocoordinates');
		return err
	} 
}

/**
 * Computes distance(miles) between two geocoordinates of user1 and user2
 * @param {number} lat1 latitude of user1
 * @param {number} lon1 longitude of user1
 * @param {number} lat2 latitude of user2
 * @param {number} lon2 longitude of user2
 * @returns {string} distance in miles
 */
function distanceBtwnGeocoords(lat1, lon1, lat2, lon2) {
    try {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            return dist
        }
    } catch (err){
        console.log(err)
        return err
    }
}

module.exports = { addressToGeocoordinates, distanceBtwnGeocoords }