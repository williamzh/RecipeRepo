var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8000");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", 'X-Requested-With,Content-Type,Authorization');
	next();
});

// Initialize controllers
require('./controllers/auth-controller')(app);
require('./controllers/recipe-controller')(app);
require('./controllers/meta-controller')(app);
require('./controllers/lang-controller')(app);

var port = process.env.PORT || 8001;
app.listen(port, function() {
	console.log('Listening on port %d', port);
});