const mongoose = require('mongoose');
const winston = require('winston');
const map = require('../helpers/map');
const maps_api_key = require('../config/config.json').development.api_key;

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: false,
	},
	birthday: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	profilePicture: {
		type: String,
	},
	favorites: {
		type: [ String ],
		default: [],
	},
	hosting: {
		type: [ String ],
		default: [],
	},
	address: {
		type: String,
	},
	fbAccessToken: {
		type: String,
		required: true,
	},
	latitude: {
		type: Number,
		required: false,
	},
	longitude: {
		type: Number,
		required: false,
	}
});

UserSchema.statics.findOrCreate = async (userInfo, done) => {
	logger.info('findOrCreate');
	let user;
	try {
		user = await User.findOne({ email: userInfo.email }).exec();
	} catch (err) {
		logger.error('findOne error');
		return done(err);
	}
	if (!user) {
		logger.info('No user. Creating user');
		try {
			user = await User.create(userInfo);
			console.log(user);
		} catch (err) { 
			logger.error('failed to create user');
			return done(err);
		}
	}
	return done(null, user);
};

UserSchema.statics.updateUser = async (updateInfo) => {
	logger.info('updateUser');
	let user;
	try {
		user = await User.findById(updateInfo._id);
		console.log(user);
	} catch (err) {
		console.log(err);
		logger.error('user update error');
		return err;
	}
	if (!user) {
		logger.error('No user to update');
		return 'No user to update';
	}
	try {
		for (let key1 of Object.keys(updateInfo)) {
			user[key1] = updateInfo[key1];

			// Update geocoordinates too if the address is updated
			if (key1 == 'address') {
				const { lat, long } = map.addressToGeocoordinates(updateInfo[key1], maps_api_key);
				user['latitude'] = lat;
				user['longitude'] = long;
			}
		}
		await user.save();
	} catch (err) {
		console.log(err);
		logger.error('failed to update user');
		return err;
	}
	return;
};

module.exports = User = mongoose.model('User', UserSchema);