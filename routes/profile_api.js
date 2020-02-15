const express = require('express');
const winston = require('winston');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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
	logger.info ('getting current users favorite games');
	const userId = req.user ? req.user._id : '5e462d9b49581001c4591a06'; // hard coded for testing
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
 * TODO: Once Google Maps API is set up, use the location of the user in order to find distance
 * This will give the information of another person's profile. The next two params are query parameters
 * @param {Integer} id the id of the person we want to get info from.
 * @param {Boolean} private true if we want the user's personal information. false if we want their public information
 */
router.get('/getProfileUserInformation', async (req, res) => {
	logger.info('getting profile users information');
	const { id, private } = req.query;
	let user;
	try {
		user = await User.findById(id);
	} catch (err) {
		logger.error(err);
		res.status(400).send(err);
	}
	if (!user) {
		return res.status(400).send('Could not find user');
	}
	const userInfo = {
		username: user.username,
		favorites: user.favorites,
		hosting: user.hosting,
		profilePicture: user.profilePicture,
	};
	if (private == 'false') {
		userInfo.firstName = user.firstName;
		userInfo.lastName = user.lastName;
		userInfo.address = user.address;
	}
	res.status(200).send(userInfo);
});

/**
 * Updates fields inside of the user database. Place update information in the request body.
 * Options are firstName, lastName, username, email, birthday, profilePicture, address, hosting, and favorites.
 * For hosting and favorites, delimit with comma. These expect you to put all of the data in there, not just the new data.
 */
router.post('/editUserInfo', async (req, res) => {
	logger.info('Edit User Information');
	const userId = req.user ? req.user._id : '5e47447c9ca2a9355632dd43'; // hard coded for testing
	const userInfo = { _id: userId };
	const { firstName, lastName, username, email, birthday, profilePicture, address, favorites, hosting } = req.body;
	if (firstName) userInfo.firstName = firstName;
	if (lastName) userInfo.lastName = lastName;
	if (username) userInfo.username = username;
	if (email) userInfo.email = email;
	if (birthday) userInfo.birthday = birthday;
	if (profilePicture) userInfo.profilePicture = profilePicture;
	if (address) userInfo.address = address;
	if (favorites) {
		const favoritesSplit = favorites.split(',');
		userInfo.favorites = favoritesSplit;
	}
	if (hosting) {
		const hostingSplit = hosting.split(',');
		userInfo.hosting = hostingSplit;
	}
	try {
		await User.updateUser(userInfo);
		res.status(200).send('Updated user');
	} catch (err) {
		console.log(err);
		res.status(400).send('Failed to Update User');
	}
});

/**
 * TODO: test with req.file after FrontEnd finished code for it
 * this endpoint allows users to edit their profile picture. Frontend: this is coded to work with an upload function
 */
router.post('/editProfilePicture', upload.single('profile'), async (req, res) => {
	logger.info('Edit Profile Picture');
	const { file } = req;
	const cloudRes = await cloudinary.uploader.upload(file);
	const { url } = cloudRes;
	const userId = req.user ? req.user._id : '5e47447c9ca2a9355632dd43'; // hard coded for testing
	const userInfo = { _id: userId, profilePicture: url };
	try {
		await User.updateUser(userInfo);
		res.status(200).send('updated profile picture');
	} catch (err) {
		console.log(err);
		res.status(400).send('Failed to update profile picture');
	}
});

module.exports = router;