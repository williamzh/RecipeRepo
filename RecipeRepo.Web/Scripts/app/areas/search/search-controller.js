recipeRepoControllers.controller('searchController', ['$scope', '$stateParams', 'apiClient', function($scope, $stateParams, apiClient) {
	$scope.searchQuery = $stateParams.query;

	$scope.search = function() {
		if(!$scope.searchQuery) {
			return;
		}

		apiClient.searchRecipes($scope.searchQuery)
			.then(function(hits) {
				$scope.hits = hits;
				$scope.hasError = false;
			})
			.catch(function() {
				$scope.hasError = true;
			});
	}
}]);