var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

// Initialize controllers
require('./controllers/auth-controller')(app);
require('./controllers/recipe-controller')(app);
require('./controllers/meta-controller')(app);
require('./controllers/user-controller')(app);
require('./controllers/lang-controller')(app);

var port = process.env.PORT || 8001;
app.listen(port, function() {
	console.log('Listening on port %d', port);
});