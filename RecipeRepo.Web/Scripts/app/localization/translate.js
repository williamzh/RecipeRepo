recipeRepoFilters.filter('translate', ['localizationService', function(localizationService) {
	return function(input) {
		if(input && input.length) {
			var keySegments = input.split('/');
			return localizationService.translate(keySegments[0], keySegments[1]); 
		}

		return '[' + input + ']';
	};
}]);