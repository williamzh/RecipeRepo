recipeRepoControllers.controller('recipeDetailsController', ['$scope', '$stateParams', '$state', 'apiClient', 'localizationService', function($scope, $stateParams, $state, apiClient, localizationService) {

	$scope.modalHeading = localizationService.translate('recipeDetails', 'confirmRemoveHeading');
	$scope.modalAction = localizationService.translate('recipeDetails', 'confirmRemoveButton');

	$scope.getRecipe = function() {
		apiClient.getRecipe($stateParams.recipeId)
			.then(function(recipe) {
				$scope.recipe = formatRecipe(recipe);
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

	$scope.removeRecipe = function() {
		apiClient.removeRecipe($scope.recipe.id)
			.then(function() {
				$state.go('home.topList');
			})
			.catch(function() {
				$scope.hasError = true;
			});
	};

	function formatRecipe(recipe) {
		recipe.groupedIngredients = recipe.ingredients.groupBy(function(ing) {
			return ing.component;
		});

		for(var metaType in recipe.meta) {
			var metaValue = recipe.meta[metaType];
			recipe.meta[metaValue] = localizationService.translate('metaTags', metaValue);
		}

		return recipe;
	}
}]);