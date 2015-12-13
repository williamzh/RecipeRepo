function TranslationStore() { }

TranslationStore.prototype.loadTranslations = function() {
	// TODO: get from user settings
	return require('./lang_' + 'sv' + '.json').values;
};

module.exports = TranslationStore;