
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://julienmcollins:3XA_4c!y5EbVtL9@gamelinks0-n8pas.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(function(err, db) {
   if (err) throw err;
   var dbo = db.db("mydb");
   var myobj = { name: "Company Inc", address: "Highway 37" };
   dbo.collection("customers").insertOne(myobj, function(err, res) {
     if (err) throw err;
     console.log("1 document inserted");
     db.close();
   });
});
