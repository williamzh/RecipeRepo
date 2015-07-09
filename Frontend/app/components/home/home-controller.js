recipeRepoControllers.controller('homeCtrl', ['$scope', 'apiClient', function($scope, apiClient) {
	$scope.search = function(searchValue) {
		return apiClient.searchRecipes(searchValue)
			.then(function(hits) {
				return hits;
			})
			.catch(function() {
				// TODO: show error
			});
	};
}]);