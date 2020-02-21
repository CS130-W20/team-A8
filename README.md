# Gamelinks
Gamelinks is a social media platform that allows users to connect and message each other over shared interest in video games. 

## Directory Structure
api_docs: API documentation folder, with miscellaneous required folders
config: Config files
frontend: Obsolete, but contains the gamelinks directory
  gamelinks: React frontend with .js and .css files; uses Ant Design for UI design
    public: React structure files
    src: React frontend structure
      components: React frontend pages as .js files, with .css files
helpers: Helper functions for running APIs
models: User profile backend
routes: API backend
  constants: Constants for use in igdb_api.js
  helper: Helper functions for running APIs in routes directory
test: Testing

## Installation/Run instructions
In the main directory, run `npm install express` and then run `node index.js` to start the backend at localhost:9000.
In the frontend/gamelinks directory, run `npm install` and then run `npm start` to start the frontend at localhost:3000.

## Relevant Links 
IGDB API
https://www.igdb.com/api

Ant Design
https://ant.design/
