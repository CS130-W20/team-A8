const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

module.exports = passport => {
	passport.use(new FacebookStrategy({
		clientID: global.gConfig.FB_APP_ID,
		clientSecret: global.gConfig.FB_APP_SECRET,
		callbackURL: global.gConfig.FB_callback+global.gConfig.port+'/auth/facebook/callback', 
		profileFields: ['id', 'email', 'name', 'birthday']
	},
	function(fbAccessToken, fbRefreshToken, profile, done) {
		logger.info('Passport creating user');
		let userInfo = {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			email: profile.emails[0].value,
			birthday: profile._json.birthday,
			fbAccessToken,
		};
		logger.info(userInfo);
		User.findOrCreate(userInfo, (err, user) => {
			if (err) {
				logger.error(err);
			}
			console.log(user);
			done(err, user);
		});
	})
	);

	passport.serializeUser(function(user, done) {
		logger.info('serializing');
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		logger.info('deserializing');
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};