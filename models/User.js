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
		user = await User.findOne({ fbId: userInfo.fbId }).exec();
	} catch (err) {
		logger.error('findOne error');
		return done(err);
	}
	if (!user) {
		logger.info('No user. Creating user')
		try {
			user = await User.create(userInfo);
		} catch (err) { 
			logger.error('failed to create user');
			console.log(err);
			return done(err);
		}
	}
	return done(null, user);
}

module.exports = User = mongoose.model('User', UserSchema);