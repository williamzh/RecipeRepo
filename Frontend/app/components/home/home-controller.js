recipeRepoControllers.controller('homeController', ['$scope', 'apiClient', function($scope, apiClient) {
	$scope.getTopRecipes = function() {
		apiClient.getRecipes()
			.then(function(recipes) {
				$scope.recipes = recipes.to(5);
			})
			.catch(function() {
				// TODO: show error
			});
	};

	$scope.search = function() {
		apiClient.searchRecipes($scope.searchQuery)
			.then(function(hits) {
				return $scope.recipes = hits;
			})
			.catch(function() {
				// TODO: show error
			});
	};
}]);