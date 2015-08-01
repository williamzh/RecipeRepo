recipeRepoDirectives.directive('rdNavbar', ['$window', function($window) {
	return {
    	restrict: 'AE',
		controller: ['$scope', '$location', 'apiClient', 'userSession', function($scope, $location, apiClient, userSession) {
			$scope.isAuthenticated = userSession.isValid();

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