var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var DbClient = require('./data/db-client');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
};
app.use(allowCrossDomain);

app.use(bodyParser.json());

// Initialize controllers
require('./controllers/auth-controller')(app);
require('./controllers/recipe-controller')(app);
require('./controllers/meta-controller')(app);
require('./controllers/user-controller')(app);
require('./controllers/lang-controller')(app);

// Initialize app
DbClient.init()
	.then(function() {
		var port = process.env.PORT || 8001;
		app.listen(port, function() {
			console.log('Listening on port %d', port);

			// Set up gracelful shutdown
			process.on ('SIGTERM', dispose);	// .e.g. kill 
			process.on ('SIGINT', dispose);		// e.g. Ctrl-C
			process.on('exit', dispose);		// Normal exit
		});
	})
	.catch(function(err) {
		console.log('Unable to connect to database. ' + err);
		process.exit(1);
	});

function dispose() {
	DbClient.destroy();
	process.exit();
}