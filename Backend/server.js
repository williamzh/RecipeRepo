var express = require('express');
var app = express();
var recipeStore = require('./recipe-store');

app.use(express.bodyParser());

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

app.post('/api/recipes', function(req, res) {
	recipeStore.add(req.body.recipe, function(data) {
		res.json(200, data);
	}, function(error) {
		res.json(500, { error: error });
	});
});

app.put('/api/recipes/:id', function(req, res) {
	recipeStore.update(req.params.id, req.body.recipe, function(data) {
		res.json(200, data);
	}, function(error) {
		res.json(500, { error: error });
	});
});

app.delete('/api/recipes/:id', function(req, res) {
	recipeStore.remove(req.params.id, function(data) {
		res.json(200, data);
	}, function(error) {
		res.json(500, { error: error });
	});
});

app.listen(8001, function() {
	console.log('Listening on port %d', 8001);
});