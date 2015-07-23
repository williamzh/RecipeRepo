recipeRepoControllers.controller('searchController', ['$scope', 'searchQueryProvider', 'apiClient', function($scope, searchQueryProvider, apiClient) {
	$scope.searchQuery = searchQueryProvider.getValue();

	if($scope.searchQuery) {
		apiClient.searchRecipes($scope.searchQuery)
			.then(function(hits) {
				$scope.hits = hits;
			})
			.catch(function() {
				// TODO: show error
			});
	}
}]);