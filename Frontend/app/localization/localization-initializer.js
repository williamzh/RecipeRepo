recipeRepoServices.service('localizationInitializer', ['$log', '$state', '$localStorage', 'userSession', 'apiClient', function($log, $state, $localStorage, userSession, apiClient) {
	
	this.load = function() {
		if($localStorage.translations) {
			return;
		}

		var currentLang = userSession.isValid() ? userSession.get().userLang : 'sv-SE';
		// Save translations in local storage
	    apiClient.getTranslations(currentLang)
			.then(function(translations) {
				$localStorage.translations = translations;
				$state.reload();
			})
			.catch(function(error) {
				$log.error('Failed to initialize translations. ' + error.message);
			});
	};
}]);