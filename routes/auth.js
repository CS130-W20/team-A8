const User = require('../models/User');
const winston = require('winston');
const ChatIO = require('../helpers/chat');
var chat = ChatIO.Chat.getInstance(null);

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
				const userId = user._id;
				req.logIn(user, function(err) {
					if (err) {
						return next(err);
					} else {
                  console.log(userId);
                  chat.setUserID(userId);
						res.status(200).redirect(`/#/profile?id=${userId}`);
					}
				});
			}
		})(req, res, next);
	});

	router.get('/logout', async (req, res) => {
		req.logout();
		res.redirect('/#/');
	});

	router.get('/deauth', async (req, res) => {
		console.log('/deauth')
		const { _id } = req.user
		await User.deauth(_id);
		res.status(200).send('Successfully deauth')
	})
}