var express = require('express');
var bodyParser = require('body-parser');
var recipeStore = require('./recipe-store');
var metainfoStore = require('./metainfo-store');

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
		success(res, data);
	}, function(err) {
		error(err);
	}, options);
});

app.get('/api/recipes/:id', function(req, res) {
	recipeStore.get(req.params.id, function(data) {
		success(res, data);
	}, function(err) {
		error(res, err);
	});
});

app.post('/api/recipes', function(req, res) {
	recipeStore.add(req.body.recipe, function(data) {
		success(res, data);
	}, function(err) {
		error(res, err);
	});
});

app.post('/api/recipes/:id', function(req, res) {
	recipeStore.update(req.params.id, req.body.recipe, function(data) {
		success(res, data);
	}, function(err) {
		error(res, err);
	});
});

app.delete('/api/recipes/:id', function(req, res) {
	recipeStore.remove(req.params.id, function(data) {
		success(res, data);
	}, function(err) {
		error(res, err);
	});
});

app.get('/api/meta/keys', function(req, res) {
	metainfoStore.getAllKeys(function(data) {
		success(res, data);
	}, function(err) {
		error(res, err);
	});
});

app.post('/api/meta/keys/:key', function(req, res) {
	metainfoStore.addKey(req.params.key, function(data) {
		success(res, data);
	}, function(err) {
		error(res, err);
	});
});

app.get('/api/meta/values/:key', function(req, res) {
	metainfoStore.getValuesForKey(req.params.key, function(data) {
		success(res, data);
	}, function(err) {
		error(res, err);
	});
});

app.listen(process.env.port || 8001, function() {
	console.log('Listening on port %d', process.env.port || 8001);
});

function success(res, result) {
	res.json(200, result);
}

function error(res, error) {
	res.json(500, { error: error });
}