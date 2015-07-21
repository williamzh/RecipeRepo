recipeRepoDirectives.directive('rdAlert', ['$window', function($window) {
	return {
    	restrict: 'E',
    	scope: {
    		type: '@',
    		messageKey: '@',
    		observe: '&'
    	},
		link: function($scope, elem) {
			$scope.$watch($scope.observe, function(newValue, oldValue, scope) {
				$scope.visible = newValue === true;
			});

			elem.find('.close').on('click', function(e) {
				$scope.visible = false;
				$scope.$apply();
			});
		 },
    	templateUrl: '/app/shared/alert/_alert.html'
	};
}]);