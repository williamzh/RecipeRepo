recipeRepoControllers.controller('searchController', ['$scope', '$stateParams', 'apiClient', function($scope, $stateParams, apiClient) {
	$scope.searchQuery = $stateParams.query;

	$scope.search = function() {
		if(!$scope.searchQuery) {
			return;
		}

		apiClient.searchRecipes($scope.searchQuery)
			.then(function(hits) {
				$scope.hits = hits;
			})
			.catch(function() {
				// TODO: show error
			});
	};
}]);