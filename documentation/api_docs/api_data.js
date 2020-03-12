define({ "api": [
  {
    "type": "get",
    "url": "/getGameInfo",
    "title": "Gets game information.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>game id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./games_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "name": "GetGetgameinfo"
  },
  {
    "type": "post",
    "url": "/addHost",
    "title": "Add host to a game in our db",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>game id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./games_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "name": "PostAddhost"
  },
  {
    "type": "post",
    "url": "/games/IncOrDecLikes",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Game ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "inc",
            "description": "<p>String for increment/decrement</p>"
          }
        ]
      }
    },
    "description": "<p>Increments or decrements the number of likes that a game has. query string inc=true/false to either increment or decrement.</p>",
    "version": "0.0.0",
    "filename": "./games_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "name": "PostGamesIncordeclikes"
  },
  {
    "type": "post",
    "url": "/remove",
    "title": "Remove host from a game in our db",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>game id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./games_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\games_api.js",
    "name": "PostRemove"
  },
  {
    "type": "get",
    "url": "/igdb/cover",
    "title": "Finds the cover picture for a game. Returns a URL to the image",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "resolution",
            "description": "<ul> <li>the resolution of the picture. Options: 720p, 1080p. Defaults to 720p. lmk if you need more resolutions.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<ul> <li>the id of the game</li> </ul>"
          }
        ]
      }
    },
    "description": "<p>Returns URL for the cover image of the relevant game</p>",
    "version": "0.0.0",
    "filename": "./igdb_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "name": "GetIgdbCover"
  },
  {
    "type": "get",
    "url": "/igdb/game",
    "title": "Gets all the relevant details needed for the game page",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<ul> <li>the id of the game</li> </ul>"
          }
        ]
      }
    },
    "description": "<p>returns object with Game details</p>",
    "version": "0.0.0",
    "filename": "./igdb_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "name": "GetIgdbGame"
  },
  {
    "type": "get",
    "url": "/igdb/popular",
    "title": "Grabs most popular games",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<ul> <li>limit the amount of results</li> </ul>"
          }
        ]
      }
    },
    "description": "<p>Returns list of JSON objects representing popular games</p>",
    "version": "0.0.0",
    "filename": "./igdb_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "name": "GetIgdbPopular"
  },
  {
    "type": "get",
    "url": "/igdb/search",
    "title": "Searches for a games. Returns name and cover picture",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<ul> <li>title to search for</li> </ul>"
          }
        ]
      }
    },
    "description": "<p>returns list of relevant games based on search parameter</p>",
    "version": "0.0.0",
    "filename": "./igdb_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "name": "GetIgdbSearch"
  },
  {
    "type": "get",
    "url": "/igdb/searchByGenre",
    "title": "Grabs most popular games by genre",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "genre",
            "description": "<ul> <li>genre search parameter</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "limit",
            "description": "<ul> <li>limit the amount of results</li> </ul>"
          }
        ]
      }
    },
    "description": "<p>Returns list of JSON objects representing popular games in genre</p>",
    "version": "0.0.0",
    "filename": "./igdb_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "name": "GetIgdbSearchbygenre"
  },
  {
    "type": "post",
    "url": "/igdb/recommendedGames",
    "title": "Grabs recommended games based on User viewing history",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "-",
            "description": "<p>JSON object with mandatory genre key associated to object mapping genre names to user view counts, optional limit key</p>"
          }
        ]
      }
    },
    "description": "<p>Returns list of JSON objects representing recommended games</p>",
    "version": "0.0.0",
    "filename": "./igdb_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\igdb_api.js",
    "name": "PostIgdbRecommendedgames"
  },
  {
    "type": "get",
    "url": "/profile/distance",
    "title": "Finds the distance between a given user and the current user;",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lat",
            "description": "<p>latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "long",
            "description": "<p>longitude</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "GetProfileDistance"
  },
  {
    "type": "get",
    "url": "/profile/getCurrentUserInformation",
    "title": "Retrieves all information about the logged in user.",
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "GetProfileGetcurrentuserinformation"
  },
  {
    "type": "get",
    "url": "/profile/getGenreHistory",
    "title": "Gets the current user's genre history",
    "description": "<p>Returns object mapping genre names to user's view counts</p>",
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "GetProfileGetgenrehistory"
  },
  {
    "type": "get",
    "url": "/profile/getProfileUserInformation",
    "title": "Get information from another user's profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the person we want to get info from.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "GetProfileGetprofileuserinformation"
  },
  {
    "type": "post",
    "url": "/profile/editProfilePicture",
    "title": "Allows users to edit their profile picture.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "file",
            "description": "<p>object file representing profile picture</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "PostProfileEditprofilepicture"
  },
  {
    "type": "post",
    "url": "/profile/editUserInfo",
    "title": "Updates fields inside of the user database",
    "description": "<p>Options are firstName, lastName, username, email, birthday, profilePicture, address, hosting, and favorites. Place update information in the request body.</p>",
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "PostProfileEdituserinfo"
  },
  {
    "type": "post",
    "url": "/profile/incrementGenreHistory",
    "title": "Updates user's genre viewing history in the user database.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "[String]",
            "optional": false,
            "field": "genres",
            "description": "<p>String array representing genres in the req.body</p>"
          }
        ]
      }
    },
    "description": "<p>(i.e. { &quot;genres&quot;: [ 12, 17, 20 ] } )</p>",
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "PostProfileIncrementgenrehistory"
  },
  {
    "type": "",
    "url": "/profile/addSharedWith",
    "title": "Adds a userId to the current user's sharedWith attribute",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the person we are adding to the array</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "ProfileAddsharedwith"
  },
  {
    "type": "",
    "url": "/profile/removeSharedWith",
    "title": "Removes a userId from the current user's sharedWith attribute",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the person we are removing from the array</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./profile_api.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\profile_api.js",
    "name": "ProfileRemovesharedwith"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./test/main.js",
    "group": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\test\\main.js",
    "groupTitle": "C:\\Users\\Will\\Desktop\\winter20\\130\\team-A8\\routes\\test\\main.js",
    "name": ""
  }
] });
