/* Require http */
var http = require("http");

/* Create dummy server for testing */
http.createServer(function (request, response) {
   // Send http header for the ok
   response.writeHead(200, {'Content-Type': 'text/plain'});

   // Send response body
   response.end('Hello World\n');
}).listen(8081);

// Console will print stuff
console.log('Server running at http://127.0.0.1:8081');