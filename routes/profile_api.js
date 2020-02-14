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
 * Updates fields inside of the user database. Place update information in the request body. Options are firstName, lastName, username, email, birthday, profilePicture.
 */
router.post('/editUserInfo', async (req, res) => {
	logger.info('Edit User Information');
	const userId = req.user ? req.user._id : '5e462d9b49581001c4591a06'; // hard coded for testing
	const userInfo = { _id: userId };
	const { firstName, lastName, username, email, birthday, profilePicture } = req.body;
	if (firstName) userInfo.firstName = firstName;
	if (lastName) userInfo.lastName = lastName;
	if (username) userInfo.username = username;
	if (email) userInfo.email = email;
	if (birthday) userInfo.birthday = birthday;
	if (profilePicture) userInfo.profilePicture = profilePicture;
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
	const userId = req.user ? req.user._id : '5e462d9b49581001c4591a06'; // hard coded for testing
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