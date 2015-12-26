recipeRepoServices.service('localizationInitializer', ['$log', '$localStorage', 'userSession', 'apiClient', function($log, $localStorage, userSession, apiClient) {
	this.load = function() {
		var currentLang = userSession.isValid() ? userSession.get().user.settings.language : 'sv-SE';
		// Save translations in local storage
	    apiClient.getTranslations(currentLang)
			.then(function(translations) {
				$localStorage.translations = translations.values;
			})
			.catch(function(error) {
				$log.error('Failed to initialize translations. ' + error.message);
			});
	};
}]);