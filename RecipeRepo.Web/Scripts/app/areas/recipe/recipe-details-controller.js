recipeRepoControllers.controller('recipeDetailsController', ['$scope', '$stateParams', '$state', '$q', 'apiClient', function($scope, $stateParams, $state, $q, apiClient) {
    $scope.initialize = function () {
        $scope.isBusy = true;

		$q.all([apiClient.getRecipe($stateParams.recipeId), apiClient.getUser()])
			.then(function(responses) {
				var recipe = responses[0];
				$scope.recipe = formatRecipe(recipe);

				var user = responses[1];
				$scope.isFavorite = user.favoriteRecipes.indexOf($scope.recipe.id) > -1;
				$scope.isEditable = user.ownedRecipes.indexOf($scope.recipe.id) > -1;

				return apiClient.addHistory(recipe.id);
			})
			.catch(function(err) {
				$scope.errorMsg = err.message;
			})
            .finally(function() {
                $scope.isBusy = false;
		    });
	};

	$scope.onFavoriteClick = function(e) {
		var isFavorite = $scope.isFavorite;
		$scope.isFavorite = !$scope.isFavorite;
		
		if(isFavorite) {
			apiClient.removeFavorite($scope.recipe.id);
		}
		else {
			apiClient.addFavorite($scope.recipe.id);
		}		
	};

	function formatRecipe(recipe) {
		recipe.groupedIngredients = recipe.ingredients.groupBy(function(ing) {
			return ing.component;
		});

		return recipe;
	}
}]);