var express = require('express');
var bodyParser = require('body-parser');
var recipeStore = new (require('./store/recipe-store'));
var metainfoStore = new (require('./store/metainfo-store'));

var app = express();

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", 'X-Requested-With,Content-Type');
	next();
});

app.get('/api/recipes', function(req, res) {
	recipeStore.getAll()
		.then(function(recipes) {
			success(res, recipes);
		}).catch(function(err) {
			error(res, err);
		});
});

app.get('/api/recipes/:id', function(req, res) {
	recipeStore.get(req.params.id)
		.then(function(recipe) {
			success(res, recipe);
		}).catch(function(err) {
			error(res, err);
		});
});

app.post('/api/recipes', function(req, res) {
	recipeStore.add(req.body.recipe)
		.then(function(data) {
			success(res, data);
		}).catch(function(err) {
			error(res, err);
		});
});

app.post('/api/recipes/search', function(req, res) {
	recipeStore.search(req.body.query)
		.then(function(hits) {
			success(res, hits);
		}).catch(function(err) {
			error(res, err);
		});
});

app.put('/api/recipes/:id', function(req, res) {
	recipeStore.update(req.params.id, req.body.recipe)
		.then(function(data) {
			success(res, data);
		}).catch(function(err) {
			error(res, err);
		});
});

app.delete('/api/recipes/:id', function(req, res) {
	recipeStore.remove(req.params.id)
		.then(function(data) {
			success(res, data);
		}).catch(function(err) {
			error(res, err);
		});
});

app.get('/api/meta/:type', function(req, res) {
	metainfoStore.getAll(req.params.type)
		.then(function(items) {
			success(res, items);
		}, function(err) {
			error(res, err);
		});
});

// app.post('/api/meta/:id', function(req, res) {
// 	metainfoStore.setMetaData(req.params.id, req.body.value, function(data) {
// 		success(res, data);
// 	}, function(err) {
// 		error(res, err);
// 	});
// });

var port = process.env.PORT || 8001;
app.listen(port, function() {
	console.log('Listening on port %d', port);
});

function success(res, result) {
	res.json(200, result);
}

function error(res, error) {
	res.json(500, { error: error });
}