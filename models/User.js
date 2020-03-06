const mongoose = require('mongoose');
const winston = require('winston');
const map = require('../helpers/map');
const maps_api_key = require('../config/config.json').development.api_key;
const genreIdToName = require('../routes/constants/genreIdToName');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console()
	]
});

var GenreStatsSchema = new mongoose.Schema({
	simulator: {
		type: Number,
		default: 0
	},
	tactical: {
		type: Number,
		default: 0
	},
	"quiz-trivia": {
		type: Number,
		default: 0
	},
	fighting: {
		type: Number,
		default: 0
	},
	strategy: {
		type: Number,
		default: 0
	},
	adventure: {
		type: Number,
		default: 0
	},
	"role-playing-rpg": {
		type: Number,
		default: 0
	},
	shooter: {
		type: Number,
		default: 0
	},
	music: {
		type: Number,
		default: 0
	},
	indie: {
		type: Number,
		default: 0
	},
	"turn-based-strategy-tbs": {
		type: Number,
		default: 0
	},
	pinball: {
		type: Number,
		default: 0
	},
	puzzle: {
		type: Number,
		default: 0
	},
	"real-time-strategy-rts": {
		type: Number,
		default: 0
	},
	"hack-and-slash-beat-em-up": {
		type: Number,
		default: 0
	},
	"visual-novel": {
		type: Number,
		default: 0
	},
	platform: {
		type: Number,
		default: 0
	},
	racing: {
		type: Number,
		default: 0
	},
	sport: {
		type: Number,
		default: 0
	},
	arcade: {
		type: Number,
		default: 0
	},
	"point-and-click": {
		type: Number,
		default: 0
	},

})

var UserStatSchema = new mongoose.Schema({
   favoriteGames: {
      type: [String],
      required: false,
   },
   timePlayed: Map,
   genres: {
	   type: GenreStatsSchema,
	   required: false
   }
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
		unique: true,
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
	sharedWith: {
		type: [ String ],
		default: [],
	},
	address: {
		type: String,
	},
	city: {
		type: String,
	},
	fbAccessToken: {
		type: String,
		required: true,
	},
	socket: {
		type: String,
		required: false,
	},
	bio: {
		type: String,
	},
	latitude: {
		type: Number,
		required: false,
	},
	longitude: {
		type: Number,
		required: false,
   },
   chatPartners: {
      type: [String],
      required: false,
   },
   userStats: {
      type: UserStatSchema,
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


UserSchema.statics.updateUserGenres = async (updateInfo) => {
	logger.info('updating User genre info');
	let user;
	try {
		user = await User.findById(updateInfo._id);
		console.log(user);
	} catch (err) {
		console.log(err);
		logger.error('user genre update error');
		return err;
	}
	if (!user) {
		logger.error('No user to update');
		return 'No user to update';
	}
	try {
		for(let genreId of updateInfo.genres){
			let genreName = genreIdToName[genreId]
			user.userStats.genres[genreName] += 1;
		}
		await user.save();
	} catch (err) {
		console.log(err);
		logger.error('failed to update user genre info');
		return err;
	}
	return;
}

UserSchema.statics.updateUserSharedWith = async (updateInfo) => {
	logger.info('updating User sharedWith');
	let user;
	try {
		user = await User.findById(updateInfo._id);
		console.log(user);
	} catch (err) {
		console.log(err);
		logger.error('user genre update error');
		return err;
	}
	if (!user) {
		logger.error('No user to update');
		return 'No user to update';
	}
	try {
		const updateId = updateInfo.updateId;
		const operation = updateInfo.operation;
		if (operation == "add"){
			user.sharedWith.push(updateId);
		} else if (operation == "remove" ) {
			const index = user.sharedWith.indexOf(updateId);
			if (index > -1){
				user.sharedWith.splice(index, 1);
			}
		}
		await user.save();
	} catch (err) {
		console.log(err);
		logger.error('failed to update user sharedWith');
		return err;
	}
	return;
}

UserSchema.statics.updateUser = async (updateInfo) => {
	logger.info('updateUser');
	console.log('sup', updateInfo)
	let user;
	try {
		user = await User.findById(updateInfo._id);
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
         if (user[key1] && user[key1].constructor === Array) {
            user[key1].push(updateInfo[key1]);
         } else {
            user[key1] = updateInfo[key1];
         }

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