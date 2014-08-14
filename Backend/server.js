var express = require('express');
var app = express();
var recipeStore = require('./recipe-store');

app.get('/api/recipes', function(req, res) {
	recipeStore.getAll(function(data) {
		res.json(200, data);
	}, function(error) {
		res.json(500, { error: error });
	});
});

app.get('/api/recipes/:id', function(req, res) {
	recipeStore.get(req.params.id, function(data) {
		res.json(200, data);
	}, function(error) {
		res.json(500, { error: error });
	});
});

app.post('/api/recipes/:id', function(req, res) {
	recipeStore.get(req.params.id, function(data) {
		res.json(200, data);
	}, function(error) {
		res.json(500, { error: error });
	});
});

app.listen(8001, function() {
	console.log('Listening on port %d', 8001);
});