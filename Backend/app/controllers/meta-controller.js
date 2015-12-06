var express = require('express');
var MetaStore = require('../core/metainfo-store');
var TokenValidator = require('../middleware/token-validator');

function MetaController(app, metaStore, tokenValidator) {
	this.metaStore = metaStore || new MetaStore();
	this.tokenValidator = tokenValidator || new TokenValidator();

	var metaRouter = express.Router();
	app.use('/api/meta', metaRouter);

	// Protect routes
	metaRouter.use(function(req, res, next) {
		this.tokenValidator.validate(req, res, next);	
	});

	metaRouter.get('/', function(req, res) {
		this.metaStore.getAll()
			.then(function(items) {
				res.json(200, items);
			}, function(err) {
				res.json(500, { error: err.message });
			});
	});

	metaRouter.get('/:name', function(req, res) {
		this.metaStore.search(req.params.name)
			.then(function(items) {
				res.json(200, items);
			}, function(err) {
				res.json(500, { error: err.message });
			});
	});

	metaRouter.post('/', function(req, res) {
		if(!req.body.metaObj) {
			res.json(400, { error: 'Meta object must be provided.' });
			return;
		}

		this.metaStore.add(req.body.metaObj)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});
}

module.exports = MetaController;

