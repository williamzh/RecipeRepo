var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var DbClient = require('./data/db-client');

app.use(bodyParser.json());

// Initialize controllers
require('./controllers/auth-controller')(app);
require('./controllers/recipe-controller')(app);
require('./controllers/meta-controller')(app);
require('./controllers/user-controller')(app);
require('./controllers/lang-controller')(app);

// Initialize app
var dbClient = new DbClient();
dbClient.init()
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
	.catch(function() {
		console.log('Unable to connect to database.');
		process.exit(1);
	});

function dispose() {
	dbClient.destroy();
	process.exit();
}