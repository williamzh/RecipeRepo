recipeRepoApp.controller('RecipeDetailsCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

	$http.get('http://localhost:8001/api/recipes/' + $routeParams.recipeId).then(function(result) {
		var recipe = result.data;

		if(!recipe) {
			// Show error - emit to main ctrl?
		}

		$scope.recipe = recipe;
	}, function() {
		// Show error - emit to main ctrl?
	});

	$scope.onFavoriteClick = function(e) {
		var recipe = angular.copy($scope.recipe);
		recipe.isFavorite = !recipe.isFavorite;

		$http.post('http://localhost:8001/api/recipes/' + recipe.recipeId, { recipe: recipe }).then(function(result) {
			$scope.recipe.isFavorite = recipe.isFavorite;
			console.log('Recipe favorite flag updated');
		}, function(error) {
			console.log('Failed to update favorite flag');
		});
	};
}]);