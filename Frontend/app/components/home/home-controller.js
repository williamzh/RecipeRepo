recipeRepoControllers.controller('homeController', ['$scope', '$state', 'apiClient', 'userSession', function($scope, $state, apiClient, userSession) {
	$scope.init = function() {
		apiClient.getTopRecipes()
			.then(function(topRecipes) {
				$scope.topRecipes = topRecipes;
			})
			.catch(function() {
				$scope.hasTopRecipesError = true;
			});

		apiClient.getLatestRecipes()
			.then(function(latestRecipes) {
				$scope.latestRecipes = latestRecipes;
			})
			.catch(function() {
				$scope.hasLatestRecipesError = true;
			});

		$scope.history = userSession.get().user.history;
	};

	$scope.search = function() {
		$state.go('home.search', { query: $scope.searchQuery });
	};

	$scope.showRecipe = function(id) {
		$state.go('recipe', { recipeId: id });
	};
}]);