There are unit test cases currently for:

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