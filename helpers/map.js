const axios = require('axios');
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

async function addressToGeocoordinates(address, api_key) {
    let geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    address = address.replace(/ +/g, "+");
    geocodeUrl += `address=${address}&key=${api_key}`;
    try {
        let result = await axios.get(geocodeUrl);
        logger.info("successfully received geocoordinates");
        let geocoordinates = result.data.results[0].geometry.location
        console.log(geocoordinates);
        return geocoordinates
        
	} catch (err) {
		console.log(err);
		logger.error('Error getting geocoordinates');
		return err
	} 
}

function distanceBtwnGeocoords(lat1, lon1, lat2, lon2) {
    try {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            res.status(200).send(0);
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
            res.status(200).send({dist});
        }
    } catch (err){
        console.log(err)
    }
}

module.exports = { addressToGeocoordinates, distanceBtwnGeocoords }