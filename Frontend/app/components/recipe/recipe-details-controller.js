recipeRepoControllers.controller('recipeDetailsController', ['$scope', '$stateParams', '$state', 'apiClient', 'localizationService', function($scope, $stateParams, $state, apiClient, localizationService) {

	$scope.modalHeading = localizationService.translate('recipeDetails', 'confirmRemoveHeading');
	$scope.modalAction = localizationService.translate('recipeDetails', 'confirmRemoveButton');

	$scope.initialize = function() {
		apiClient.getRecipe($stateParams.recipeId)
			.then(function(recipe) {
				recipe.meta.lastViewed = Date.create();
				apiClient.updateRecipe(recipe);

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
				$state.go('home.start');
			})
			.catch(function() {
				$scope.hasError = true;
			});
	};

	function formatRecipe(recipe) {
		recipe.groupedIngredients = recipe.ingredients.groupBy(function(ing) {
			return ing.component;
		});

		recipe.meta.cuisine = localizationService.translate('metaTags', recipe.meta.cuisine);
		recipe.meta.category = localizationService.translate('metaTags', recipe.meta.category);
		recipe.meta.course = localizationService.translate('metaTags', recipe.meta.course);

		return recipe;
	}
}]);