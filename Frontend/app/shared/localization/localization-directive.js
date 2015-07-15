recipeRepoDirectives.directive('rdTranslate', function() {
	return {
    	restrict: 'AE',
    	scope: {
    		key: '@',
    		attr: '@?'
    	},
		controller: ['$scope', 'localizationService', function($scope, localizationService) {
			var keySegments = $scope.key.split('/');
			$scope.translatedValue = localizationService.translate(keySegments[0], keySegments[1]);
		}],
		link: function(scope, elem, attrs) {
			var unwatch = scope.$watch('translatedValue', function(newValue) {
				if(newValue) {
					if(scope.attr) {
						elem.attr(scope.attr, newValue);
					}
					else {
						elem.text(newValue);
					}
					unwatch();
				}
			});
		 }
	};
});