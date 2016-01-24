recipeRepoControllers.controller('homeController', ['$scope', '$state', 'Slug', 'apiClient', 'userSession', function($scope, $state, Slug, apiClient, userSession) {
	$scope.init = function() {
		// Latest recipes
		var dateFilter = Date.create().addDays(-10).toISOString();
		apiClient.findRecipes({ fieldName: 'Meta.Created', value: dateFilter, strategy: 'GreaterThan' })
			.then(function(latestRecipes) {
				$scope.latestRecipes = latestRecipes;
			})
			.catch(function() {
				$scope.hasLatestRecipesError = true;
			});

		// Top recipes
		apiClient.findRecipes({ fieldName: 'Meta.RelativeScore', value: 1, strategy: 'GreaterThan' })
			.then(function(topRecipes) {
				$scope.topRecipes = topRecipes;
			})
			.catch(function() {
				$scope.hasTopRecipesError = true;
			});

		// History
		apiClient.getHistory()
			.then(function(history) {
				$scope.history = history;
			})
			.catch(function() {
				$scope.hasHistoryError = true;
			});
	};

	$scope.search = function() {
		$state.go('search', { query: $scope.searchQuery });
	};

	$scope.showRecipe = function(recipe) {
		var slug = Slug.slugify(recipe.name);
		$state.go('recipe', { recipeId: recipe.id, recipeName: slug });
	};

	$scope.removeHistory = function(recipeId) {
		apiClient.removeHistory(recipeId)
			.then(function() {
				$scope.history.remove(function(h) {
					return h.id === recipeId;
				});
			});
	};
}]);