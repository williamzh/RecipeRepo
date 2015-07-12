recipeRepoControllers.controller('favoritesController', ['$scope', 'apiClient', function($scope, apiClient) {
	$scope.getFavoriteRecipes = function() {
		apiClient.getRecipes()
			.then(function(recipes) {
				$scope.recipes = recipes.findAll(function(r) { return r.isFavorite == true; });
			})
			.catch(function() {
				// TODO: show error
			});
	};
}]);