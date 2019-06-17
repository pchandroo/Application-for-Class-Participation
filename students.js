// Importing the required package
var express = require('express');
var mysql = require('mysql');


var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


var port = process.env.PORT || 3000;

// Establishing the connection with the DB
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'students_vote'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('Connected to DB!');
});


// Upload the options selected the by the students into the database
app.post('/upload', function(req, res){
	var reg_no = req.body.C_ID;
    var choice = req.body.Option;
	console.log(reg_no);
	console.log(choice);
	query = "REPLACE INTO votes(C_ID, Option) VALUES (?,?)";

	connection.query(query, [reg_no, choice], function(err, results) {
    if (err) throw err
		res.header("Access-Control-Allow-Origin", "*");
		res.send(true);
      });
});


// Clear the table
app.get('/clear', function(req, res){

	query = "TRUNCATE votes";

	connection.query(query, function(err, results) {
    if (err) throw err
		res.header("Access-Control-Allow-Origin", "*");
		res.send(true);
      });
});


//Retrieves the count of each options from the DB
app.get('/results', function(req, res){

	query = "SELECT Option, count(Option) AS number FROM votes GROUP by Option";

	connection.query(query, function(err, results) {
    if (err) throw err
		res.header("Access-Control-Allow-Origin", "*");

		var jsonObj = {'Option': 'Count'};

		for(var i =0; i< results.length; i++)
		{
			jsonObj[results[i].Option] = results[i].number;	
			console.log(results[i].Option);
			console.log(results[i].number);
		}

		console.log(jsonObj);
		console.log(results)
		res.send(jsonObj);
      });
});

app.listen(port);
console.log('Server started! At http://localhost:' + port);