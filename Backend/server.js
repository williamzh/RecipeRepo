var express = require('express');
var app = express();

// Modules
var recipeStore = require('./recipe-store');

// Routes
app.get('/api/recipes', function(req, res) {
	recipeStore.getAll(function(data) {
		res.json(data);
	}, function(error) {
		res.json(error);
	});
});
app.get('/api/recipes/:id', function(req, res) {
	recipeStore.get(req.params.id, function(data) {
		res.json(data);
	}, function(error) {
		res.json(error);
	});
});


app.listen(8001, function() {
	console.log('Listening on port %d', 8001);
});