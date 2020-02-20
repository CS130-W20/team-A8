const assert = require('assert');
const mapFunctions = require('../helpers/map');
const igdbFunctions = require('../routes/helpers/igdb_helper');

describe('Map Functions', function() {
    /*
  describe('#addressToGeocoordinates()', function() {
    // A string explanation of what we're testing
    it('should return an object with a latitude and longitude specified', async function(){
      // Our actual test
        let geocoordinates = await mapFunction.addressToGeocoordinates('532 midvale ave, los angeles, ca');
        let keys = Object.keys(geocoordinates);
        assert.equal(keys.length, 2);
    });
    it('should return an object with no key values if given an invalid address', async function (){
        let result = await mapFunction.addressToGeocoordinates('!');
        assert.equal(result, 'No results for address');
    });
  });*/

  describe('#distanceBtwnGeocoords()', function() {
      it('should return a distance if the points are not equal', function (){
          assert.equal(typeof mapFunctions.distanceBtwnGeocoords(34.0659316,-118.4528627,34.0671841,-118.4523218), typeof 5.0)
      });
      it('should return 0 if the points are equal', function() {
          assert.equal(mapFunctions.distanceBtwnGeocoords(1.5,3,1.5,3),0);
      })
  })
});

describe('IGDB APis', function() {
    describe('#getGames()', function() {
        it('should return a list of top 10 popular games', async function() {
            let games = await igdbFunctions.getGames(null,null);
            assert.equal(games.length, 10);
        });
        it('should return a list of top 10 popular games of genre 4 (fighting)', async function () {
            let games = await igdbFunctions.getGames(4,null);
            assert.equal(games.length, 10);
        });
        it('should return a list of top 20 popular games', async function() {
            let games = await igdbFunctions.getGames(null,20);
            assert.equal(games.length, 20);
        });
    });
    describe('#getCover()', function() {
        it('should return a url corresponding to the cover image', async function() {
            let url = await igdbFunctions.getCover(80258, null);
            assert.equal(typeof url, typeof '');
        });
        it('should return an error if there is an incorrect id passed', async function() {
            let url = await igdbFunctions.getCover(9999123, null);
            let err = new Error()
            assert.equal(typeof url, typeof err);
        });
    });    
    describe('#getGameDetail()', function() {
        it('should return an object containing details about this particular screenshot detail', async function() {
            let gameDetails = await igdbFunctions.getGameDetail('screenshots', 30162);
            let keys = Object.keys(gameDetails);
            assert.equal(keys.length,2);
        });        
        it('should return an error due to invalid input', async function() {
            let gameDetails = await igdbFunctions.getGameDetail('bleh', 1);
            let keys = Object.keys(gameDetails);
            assert.notEqual(keys.length,2);
        });
    });
});