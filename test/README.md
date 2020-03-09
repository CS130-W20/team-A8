There are unit test cases currently for:

    helpers_test.js:
        Map Functions:
        addressToGeocoordinates()
            2 test cases validating correct input and catching incorrect input
        distanceBtwnGeocoords()
            2 test cases validating proper execution and having 0 result for equal points

        IGDB APIs:
        getGames()
            3 test cases, validating vanilla call, genre call, and limit call
        getCover()
            2 test cases, validating normal call, and catching call with incorrect id
        getGameDetail()
            2 test cases, validating call with proper game detail and id, and catching error from invalid input

igdb_routes_test.js
    Game Search and Browsing Scenario
        Get 10 most popular games ->
        Get 5 most popular games -> 
        Search by a specific genre -> 
        Search by a specific string ->
        Get recommended games for a specific user -> 
        Get specific details from a game

games_routes_test.js
    Game Lifecycle Scenario
        Check game not created in db->
        Create game and increment like and verify incremented like->
        Decrement Like and verify decremented like ->
        Add Host to Game and verify host added->
        Remove Host and verify host removed

profile_routes_test.js:
    User Profile Lifecycle Scenario
        Testing user creation -> 
        Updating (adding/removing) different user attributes from the model (bio, favorites) -> 
        Incrementing genre viewing history