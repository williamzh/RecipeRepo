recipeRepoServices.service('localizationInitializer', ['$localStorage', 'apiClient', function($localStorage, apiClient) {
	this.load = function() {
		// Save translations in local storage
	    apiClient.getTranslations()
			.then(function(translations) {
				$localStorage.translations = translations;
			})
			.catch(function(error) {
				// Do what?
			});
	};
}]);