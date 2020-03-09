const express = require('express');
const winston = require('winston');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('../models/User');
const map = require('../helpers/map');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }).single('myImage');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

cloudinary.config({
	cloud_name: global.gConfig.CLOUDINARY_NAME,
	api_key: global.gConfig.CLOUDINARY_KEY,
	api_secret: global.gConfig.CLOUDINARY_SECRET
});

/**
 * @api {get} /profile/getCurrentUserInformation Retrieves all information about the logged in user.
 */
router.get('/getCurrentUserInformation', async (req, res) => {
	logger.info ('getting current users');
	const userId = req.user ? req.user._id : "5e5ec0db5839764b608826c6"; // hard coded for testing
	let userInfo;
	try {
		userInfo = await User.findById(userId);
	} catch (err) {
		logger.error('got an error finding user');
		res.status(400).send(err);
	}
	res.status(200).send(userInfo);
});

/**
 * TODO: Once Google Maps API is set up, use the location of the user in order to find distance. put this in public information.
 * @api {get} /profile/getProfileUserInformation Get information from another user's profile
 * @apiParam {Integer} id the id of the person we want to get info from.
 */
router.get('/getProfileUserInformation', async (req, res) => {
	logger.info('getting profile users information');
	const { id } = req.query;
	let user;
	try {
		user = await User.findById(id);
	} catch (err) {
		logger.error(err);
		return res.status(400).send(err);
	}
	if (!user) {
		res.status(400).send('Could not find user');
	} else {
		const userInfo = {
			_id: user._id,
			username: user.username,
			favorites: user.favorites,
			hosting: user.hosting,
			profilePicture: user.profilePicture,
			bio: user.bio,
			city: user.city,
			latitude: user.latitude,
			longitude: user.longitude,
		};
		if (req.user && (user.sharedWith.includes(JSON.stringify(req.user._id)) || JSON.stringify(req.user._id) == JSON.stringify(user._id))) {
			userInfo.firstName = user.firstName;
			userInfo.lastName = user.lastName;
			userInfo.address = user.address;
		}
		res.status(200).send(userInfo);
	}
});

/**
 * @api {post} /profile/editUserInfo Updates fields inside of the user database 
 * @apiDescription Options are firstName, lastName, username, email, birthday, profilePicture, address, hosting, and favorites.
 * Place update information in the request body.
 */
router.post('/editUserInfo', async (req, res) => {
	logger.info('Edit User Information');
	const userId = req.user ? req.user._id : '5e5ec0db5839764b608826c6'; // hard coded for testing
	const userInfo = { _id: userId, ...req.body };
	console.log(req.body);
	let err = await User.updateUser(userInfo);
	console.log(err);
	err ? res.status(400).send('Failed to Update User') : res.status(200).send('Updated user');
});

/**
 * TODO: test with req.file after FrontEnd finished code for it
 *  Frontend: this is coded to work with an upload function
 * @api {post} /profile/editProfilePicture Allows users to edit their profile picture.
 * @apiParam {Object} file object file representing profile picture
 */

router.post('/editProfilePicture', upload, async (req, res) => {
	logger.info('Edit Profile Picture');
	const { file } = req;
	let cloudRes;
	try {
		cloudRes = await cloudinary.uploader.upload(`./uploads/${req.file.filename}`);	
	} catch (err) {
		console.log(err);
	}
	const { url } = cloudRes;
	const userId = req.user ? req.user._id : '5e5ec0db5839764b608826c6'; // hard coded for testing
	const userInfo = { _id: userId, profilePicture: url };
	try {
		await User.updateUser(userInfo);
		res.status(200).send(url);
	} catch (err) {
		console.log(err);
		res.status(400).send('Failed to update profile picture');
	}
});

/**
 * @api {get} /profile/distance Finds the distance between a given user and the current user;
 * @apiParam {Number} lat latitude
 * @apiParam {Number} long longitude
 */
router.get('/distance', async (req, res) => {
	logger.info('/distance')
	const userId = req.user ? req.user._id : '5e658f62f143961df1ac0bb5';
	const { lat, long } = req.query;
	let userInfo;
	try {
		userInfo = await User.findById(userId);
	} catch (err) {
		logger.error('got an error finding user');
		return res.status(400).send(err);
	}
	const distance = map.distanceBtwnGeocoords(lat, long, userInfo.latitude, userInfo.longitude)
	console.log('DISTANCE-----------------------------------------------', distance)
	res.status(200).send({distance});
});

/**
 * @api {post} /profile/incrementGenreHistory Updates user's genre viewing history in the user database. 
 * @apiParam {[String]} genres String array representing genres in the req.body 
 * @apiDescription (i.e. { "genres": [ 12, 17, 20 ] } )
 */
router.post('/incrementGenreHistory', async (req,res) => {
	logger.info('Increment Genre History');
	const userId = req.user ? req.user._id : '5e5ec0db5839764b608826c6'; // hard coded for testing
	const userInfo = { _id: userId};
	let genreIds = req.body.genres;
	userInfo.genres = genreIds
	let err = await User.updateUserGenres(userInfo);
	err ? res.status(400).send('Failed to Update genre history') : res.status(200).send('Updated genre history');
})

/**
 * @api {get} /profile/getGenreHistory Gets the current user's genre history
 * @apiDescription Returns object mapping genre names to user's view counts
 */
router.get('/getGenreHistory', async(req,res) => {
	logger.info ('getting current user\'s genre history');
	const userId = req.user ? req.user._id : "5e5ec0db5839764b608826c6"; // hard coded for testing
	let userInfo;
	try {
		userInfo = await User.findById(userId);
	} catch (err) {
		logger.error('got an error finding user');
		res.status(400).send(err);
	}
	res.status(200).send(userInfo.userStats.genres);
})

/**
 * @api /profile/addSharedWith Adds a userId to the current user's sharedWith attribute
 * @apiParam {String} id the id of the person we are adding to the array
 */
router.post('/addSharedWith', async(req,res) => {
	logger.info('adding to User\'s sharedWith attribute');
	const userId = req.user ? req.user._id : '5e575cf533813248d7906079'; // hard coded for testing
	const { id } = req.query;
	const updateJson = { _id: userId, updateId: id, operation: "add" };
	let err = await User.updateUserSharedWith(updateJson);
	err ? res.status(400).send('Failed to add to sharedWith attribute') : res.status(200).send('Updated sharedWith attribute');
})

/**
 * @api /profile/removeSharedWith Removes a userId from the current user's sharedWith attribute
 * @apiParam {String} id the id of the person we are removing from the array
 */
router.post('/removeSharedWith', async(req,res) => {
	logger.info('removing from User\'s sharedWith attribute');
	const userId = req.user ? req.user._id : '5e5ec0db5839764b608826c6'; // hard coded for testing
	const { id } = req.query;
	const updateJson = { _id: userId, updateId: id, operation: "remove" };
	let err = await User.updateUserSharedWith(updateJson);
	err ? res.status(400).send('Failed to remove from sharedWith attribute') : res.status(200).send('Updated sharedWith attribute');
})

router.get('/searchByUser', async (req, res) => {
   logger.info('searching by user');
   const { nickname } = req.query;
   let user;
   try {
      user = await User.findOne({ username: nickname });
      console.log(user);
   } catch (err) {
      logger.error('error finding user');
      res.status(400).send(err);
   }
   if (!user) {
      logger.error('unable to find user');
      res.status(400).send('error finding user');
   }
   res.status(200).send(user._id);
})

module.exports = router;