var express = require('express');
var TranslationStore = require('../localization/translation-store');
var TokenValidator = require('../core/auth/token-validator');

function LangController(app, translationStore, tokenValidator) {
	this.translationStore = translationStore || new TranslationStore();
	this.tokenValidator = tokenValidator || new TokenValidator();

	var langRouter = express.Router();
	app.use('/api/lang', langRouter);

	// Protect routes
	langRouter.use(function(req, res, next) {
		this.tokenValidator.validate(req, res, next);	
	});

	langRouter.get('/translate', function(req, res) {
		res.json(200, this.translationStore.loadTranslations());
	});
}

module.exports = LangController;

