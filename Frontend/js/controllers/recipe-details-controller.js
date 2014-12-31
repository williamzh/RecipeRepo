recipeRepoApp.controller('RecipeDetailsCtrl', ['$scope', '$routeParams', 'apiClient', function($scope, $routeParams, apiClient) {

	apiClient.getRecipe($routeParams.recipeId).then(function(recipe) {
		$scope.recipe = recipe;
	});

	$scope.onFavoriteClick = function(e) {
		var recipe = angular.copy($scope.recipe);
		recipe.isFavorite = !recipe.isFavorite;

		apiClient.updateRecipe(recipe).then(function(response) {
			$scope.recipe.isFavorite = recipe.isFavorite;
		});
	};
}]);