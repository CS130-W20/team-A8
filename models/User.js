const mongoose = require('mongoose');
const winston = require('winston');

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
	profileName: {
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
	location: { // Not sure if should use Lat/long or addr yet.
		type: String,
	},
	profilePicture: {
		type: String,
	},
	fbAccessToken: {
		type: String,
		required: true,
   },
   socket: {
      type: String,
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
		user = await User.findOne({ _id: updateInfo._id });
	} catch (err) {
		logger.error('user update error');
		return;
	}
	if (!user) {
		logger.error('No user to update');
		return;
	}
	try {
		await user.update(updateInfo);
	} catch (err) {
		logger.error('failed to update user');
		return;
	}
	return user;
};

module.exports = User = mongoose.model('User', UserSchema);