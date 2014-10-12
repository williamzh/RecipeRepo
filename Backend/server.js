var express = require('express');
var bodyParser = require('body-parser');
var recipeStore = require('./recipe-store');

var app = express();

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", 'Content-Type');
  next();
 });

app.get('/api/recipes', function(req, res) {
	var options = req.query.groupBy ? { 'groupBy': req.query.groupBy } :
		req.query.sortBy ? { 'sortBy': req.query.sortBy } :
		undefined;

	recipeStore.getAll(function(data) {
		res.json(200, data);
	}, function(error) {
		res.json(500, { error: error });
	}, options);
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

app.post('/api/recipes/:id', function(req, res) {
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