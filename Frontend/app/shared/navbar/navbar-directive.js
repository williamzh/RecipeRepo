recipeRepoDirectives.directive('rdNavbar', ['$window', function($window) {
	return {
    	restrict: 'AE',
		controller: ['$scope', '$location', 'apiClient', function($scope, $location, apiClient) {
			// TODO: inject authentication service
			$scope.isAuthenticated = true;

			$scope.onSearchSelect = function($item, $model, $label) {
				$location.path('/recipes/' + $item.id);
			};
		}],
		link: function(scope, elem, attrs) {
			elem.find('.back-btn').on('click', function() {
		    	$window.history.back();
		 	});
		 },
    	templateUrl: '/app/shared/navbar/_navbar.html'
	};
}]);