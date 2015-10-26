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
				res.json(500, { error: err });
			});
	});
}

module.exports = MetaController;

