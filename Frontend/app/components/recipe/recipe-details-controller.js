recipeRepoControllers.controller('recipeDetailsController', ['$scope', '$q', '$stateParams', 'apiClient', function($scope, $q, $stateParams, apiClient) {

	$scope.getRecipe = function() {
		$q.all([apiClient.getRecipe($stateParams.recipeId), apiClient.getMetainfo()])
			.then(function(responses) {
				var recipe = responses[0];
				var metainfo = responses[1];

				$scope.recipe = formatRecipe(recipe, metainfo);
				$scope.isAuthenticated = true;
				$scope.hasError = false;
			})
			.catch(function() {
				$scope.hasError = true;
			});
	};

	$scope.onFavoriteClick = function(e) {
		var recipe = angular.copy($scope.recipe);
		recipe.isFavorite = !recipe.isFavorite;

		apiClient.updateRecipe(recipe).then(function(response) {
			$scope.recipe.isFavorite = recipe.isFavorite;
		});
	};

	function formatRecipe(recipe, metainfo) {
		recipe.groupedIngredients = recipe.ingredients.groupBy(function(ing) {
			return ing.component;
		});

		for(var metaKey in recipe.meta) {
			var metaId = recipe.meta[metaKey];
			var metaName = metainfo[metaKey][metaId].name;
			recipe.meta[metaKey] = metaName;	// TODO: translate
		}

		return recipe;
	}
}]);