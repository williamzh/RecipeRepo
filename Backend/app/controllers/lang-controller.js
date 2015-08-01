var express = require('express');
var TranslationStore = require('../localization/translation-store');

function LangController(app, translationStore, tokenValidator) {
	this.translationStore = translationStore || new TranslationStore();

	var langRouter = express.Router();
	app.use('/api/lang', langRouter);

	langRouter.get('/translations', function(req, res) {
		res.json(200, this.translationStore.loadTranslations());
	});
}

module.exports = LangController;

