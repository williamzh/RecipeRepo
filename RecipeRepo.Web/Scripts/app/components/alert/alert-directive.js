recipeRepoDirectives.directive('alert', ['$window', function($window) {
	return {
    	restrict: 'E',
    	scope: {
    		type: '@',
    		preamble: '@',
    		message: '@'
    	},
		link: function($scope, elem) {
			// $scope.$watch($scope.observe, function(newValue, oldValue, scope) {
			// 	$scope.isVisible = newValue === true;
			// });

			$scope.isVisible = true;

			elem.find('.Alert-close').on('click', function(e) {
				$scope.isVisible = false;
				$scope.$apply();
			});
		 },
    	templateUrl: '/Scripts/app/components/alert/_alert.html'
	};
}]);