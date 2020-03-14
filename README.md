# Gamelinks
Gamelinks is a social media platform that allows users to connect and message each other over shared interest in video games. 

## Directory Structure
config: Config files with api keys and database links

documentation: API documentation folder, with miscellaneous required folders

frontend: Contains the gamelinks directory

    gamelinks: React frontend with .js and .css files; uses Ant Design for UI design
    
      build: Static files generated from npm run build (copy them to static in the main directory)
  
      public: React structure files
    
      src: React frontend structure
    
        components: React frontend pages as .js files, with .css files
      
helpers: Helper functions for our APIs

models: Backend and database schemas

routes: API and backend routes

    constants: Constants for use in igdb_api.js
  
    helper: Helper functions for running APIs in routes directory
 
static: Static files generated from frontend/gamelinks/build; need to manually update
  
test: Testing

## Installation/Run instructions
If the static folder in the main directory already exists, run `npm install` and then run `node index.js` to start the backend at localhost:9000.

In case you need to create files in the static folder, go to frontend/gamelinks and run `npm install` and then run `npm run build` to create the build folder. Copy the contents of this folder into a static folder in the main directory.

PLEASE NOTE:
Currently the Facebook login system is not open to registration. Please use one of these provided Facebook test accounts to log in and use the website:


username / password:

qnqwotthar_1584150026@tfbnw.net / gamelinks

open_gqpusyv_user@tfbnw.net / gamelinks

jwctgamelinks@gmail.com / gamelinks123!

## Relevant Links 
IGDB API
https://www.igdb.com/api

Ant Design
https://ant.design/

Passport.js
http://www.passportjs.org/
