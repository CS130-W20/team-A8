const User = require('../models/User');
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = (router, passport) => {
	router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'user_birthday'] }));

	router.get('/facebook/callback', function(req, res, next) {
		passport.authenticate('facebook', function(err, user) {
			if (err || !user) {
				logger.error(err);
				res.status(400).send("Error Logging in");

			} else {
				req.logIn(user, function(err) {
					if (err) {
						return next(err);
					} else {
						console.log('here');
						return res.redirect(global.gConfig.FB_callback + global.gConfig.front_port);
					}
				});
			}
		})(req, res, next);
	});

	router.get('/deauth', async (req, res) => {
		console.log('/deauth')
		const { _id } = req.user
		await User.deauth(_id);
		res.status(200).send('Successfully deauth')
	})
}