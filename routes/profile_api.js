const express = require('express');
const winston = require('winston');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('../models/User');
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
 * Retrieves all information about the logged in user.
 */
router.get('/getCurrentUserInformation', async (req, res) => {
	logger.info ('getting current users');
	console.log('req', req.user);
	const userId = req.user ? req.user._id : null; // hard coded for testing
	let userInfo;
	try {
		userInfo = await User.findById(userId);
	} catch (err) {
		logger.error('got an error finding user');
		res.status(400).send(err);
	}
	console.log('userinfo', userInfo);
	res.status(200).send(userInfo);
});

/**
 * TODO: Once Google Maps API is set up, use the location of the user in order to find distance. put this in public information.
 * This will give the information of another person's profile. The next two params are query parameters
 * @param {Integer} id the id of the person we want to get info from.
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
		};
		if (req.user && (user.sharedWith.includes(req.user._id) || req.user._id === user._id)) {
			userInfo.firstName = user.firstName;
			userInfo.lastName = user.lastName;
			userInfo.address = user.address;
		}
		console.log('profile', userInfo);
		res.status(200).send(userInfo);
	}
});

/**
 * Updates fields inside of the user database. Place update information in the request body.
 * Options are firstName, lastName, username, email, birthday, profilePicture, address, hosting, and favorites.
 */
router.post('/editUserInfo', async (req, res) => {
	logger.info('Edit User Information');
	const userId = req.user ? req.user._id : '5e4dda4dff01201577298b58'; // hard coded for testing
	const userInfo = { _id: userId };
	const { firstName, lastName, username, email, sharedWith, birthday, city, profilePicture, address, favorites, hosting, bio, socket } = req.body;
	if (firstName) userInfo.firstName = firstName;
	if (lastName) userInfo.lastName = lastName;
	if (username) userInfo.username = username;
	if (email) userInfo.email = email;
	if (birthday) userInfo.birthday = birthday;
	if (profilePicture) userInfo.profilePicture = profilePicture;
	if (address) userInfo.address = address;
	if (bio) userInfo.bio = bio;
	if (socket) userInfo.socket = socket;
	if (favorites) userInfo.favorites = favorites;
	if (sharedWith) userInfo.sharedWith = sharedWith;
	if (hosting) userInfo.hosting = hosting;
	if (city) userInfo.city = city;
	console.log(userInfo);
	let err = await User.updateUser(userInfo);
	err ? res.status(400).send('Failed to Update User') : res.status(200).send('Updated user');
});

/**
 * TODO: test with req.file after FrontEnd finished code for it
 * this endpoint allows users to edit their profile picture. Frontend: this is coded to work with an upload function
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
	const userId = req.user ? req.user._id : '5e4dda4dff01201577298b58'; // hard coded for testing
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
 * Updates user's genre viewing history in the user database. 
 * (i.e. { "genres": [ 12, 17, 20 ] } )
 */
router.post('/incrementGenreHistory', async (req,res) => {
	logger.info('Increment Genre History');
	const userId = req.user ? req.user._id : '5e5ec0db5839764b608826c6'; // hard coded for testing
	const userInfo = { _id: userId};
	console.log(req.body);
	let genreIds = req.body.genres;
	userInfo.genres = genreIds
	let err = await User.updateUserGenres(userInfo);
	err ? res.status(400).send('Failed to Update genre history') : res.status(200).send('Updated genre history');
})

router.get('/getGenreHistory', async(req,res) => {
	logger.info ('getting current user\'s genre history');
	console.log(req.user)
	console.log(req.session)
	const userId = req.user ? req.user._id : "5e5ec0db5839764b608826c6"; // hard coded for testing
	let userInfo;
	try {
		userInfo = await User.findById(userId);
	} catch (err) {
		logger.error('got an error finding user');
		res.status(400).send(err);
	}
	console.log(userInfo.userStats.genres);
	res.status(200).send(userInfo.userStats.genres);
})
module.exports = router;