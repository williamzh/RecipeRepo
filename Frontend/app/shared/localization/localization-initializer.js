recipeRepoServices.service('localizationInitializer', ['$log', '$localStorage', 'apiClient', function($log, $localStorage, apiClient) {
	this.load = function() {
		// Save translations in local storage
	    apiClient.getTranslations()
			.then(function(translations) {
				$localStorage.translations = translations;
			})
			.catch(function(error) {
				$log.error('Failed to initialize translations. ' + error.message);
			});
	};
}]);