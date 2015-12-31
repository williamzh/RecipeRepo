recipeRepoControllers.controller('homeController', ['$scope', '$state', 'Slug', 'apiClient', 'userSession', function($scope, $state, Slug, apiClient, userSession) {
	$scope.init = function() {
		// Top recipes
		apiClient.findRecipes({ fieldName: 'Meta.Rating', value: 3, strategy: 'GreaterThan' })
			.then(function(topRecipes) {
				$scope.topRecipes = topRecipes;
			})
			.catch(function() {
				$scope.hasTopRecipesError = true;
			});

		// Latest recipes
		var dateFilter = Date.create().addDays(-10).toISOString();
		apiClient.findRecipes({ fieldName: 'Meta.Created', value: dateFilter, strategy: 'GreaterThan' })
			.then(function(latestRecipes) {
				$scope.latestRecipes = latestRecipes;
			})
			.catch(function() {
				$scope.hasLatestRecipesError = true;
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
		$state.go('home.search', { query: $scope.searchQuery });
	};

	$scope.showRecipe = function(recipe) {
		var slug = Slug.slugify(recipe.name);
		$state.go('recipe', { recipeId: recipe.id, recipeName: slug });
	};
}]);