recipeRepoControllers.controller('RecipeDetailsCtrl', ['$scope', '$routeParams', 'apiClient', function($scope, $routeParams, apiClient) {

	apiClient.getRecipe($routeParams.recipeId).then(function(recipe) {
		$scope.recipe = appendGroupIngredients(recipe);
		$scope.isAuthenticated = true;
		$scope.hasError = false;
	}, function() {
		$scope.hasError = true;
	});

	$scope.onFavoriteClick = function(e) {
		var recipe = angular.copy($scope.recipe);
		recipe.isFavorite = !recipe.isFavorite;

		apiClient.updateRecipe(recipe).then(function(response) {
			$scope.recipe.isFavorite = recipe.isFavorite;
		});
	};

	function appendGroupIngredients(recipe) {
		recipe.groupedIngredients = recipe.ingredients.groupBy(function(ing) {
			return ing.component;
		});

		return recipe;
	}
}]);