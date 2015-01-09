recipeRepoDirectives.directive('rdNavbar', ['$window', function($window) {
	return {
    	restrict: 'A',
		controller: ['$scope', '$location', 'apiClient', function($scope, $location, apiClient) {
			// TODO: inject authentication service
			$scope.isAuthenticated = true;

			$scope.search = function(searchValue) {
				return apiClient.searchRecipes(searchValue).then(function(hits) {
					$scope.hits = hits;
					return hits.map(function(hit) {
						return hit.recipeName;
					});
				});
			};

			$scope.onSearchSelect = function($item, $model, $label) {
				var selectedHit = $scope.hits.find(function(h) {
					return h.recipeName == $item;
				});
				$location.path('/recipes/' + selectedHit.id);
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