recipeRepoDirectives.directive('rdNavbar', ['$window', function($window) {
	return {
    	restrict: 'A',
		controller: ['$scope', '$location', 'apiClient', function($scope, $location, apiClient) {
			// TODO: inject authentication service
			$scope.isAuthenticated = true;

			$scope.search = function(searchValue) {
				return apiClient.searchRecipes(searchValue).then(function(hits) {
					return hits;
				});
			};

			$scope.onSearchSelect = function($item, $model, $label) {
				$location.path('/recipes/' + $item.id);
			};
		}],
		link: function(scope, elem, attrs) {
			elem.find('.back-btn').on('click', function() {
		    	$window.history.back();
		 	});
		 },
    	templateUrl: 'partials/_navbar.html'
	};
}]);