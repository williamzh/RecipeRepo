recipeRepoServices.service('localizationService', ['$localStorage', function($localStorage) {
	this.translate = function(area, key) {
		var translations = $localStorage.translations;
		if(translations) {
			var matchingArea = translations[area];
			if(matchingArea) {
				 var matchingTranslation = matchingArea[key];
				 if(matchingTranslation) {
				 	return matchingTranslation;
				 }	
			}
		}

		return '[{1}/{2}]'.assign(area, key);
	};
}]);