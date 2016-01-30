recipeRepoControllers.controller('homeController', ['$scope', '$state', '$q', 'apiClient', function($scope, $state, $q, apiClient) {
    $scope.init = function () {
        $scope.isBusy = true;

        var dateFilter = Date.create().addDays(-10).toISOString();
        var latestRecipesPromise = apiClient.findRecipes({ fieldName: 'Meta.Created', value: dateFilter, strategy: 'GreaterThan' });
        var topRecipesPromise = apiClient.findRecipes({ fieldName: 'Meta.RelativeScore', value: 1, strategy: 'GreaterThan' });

        $q.all([latestRecipesPromise, topRecipesPromise])
            .then(function(responses) {
                $scope.latestRecipes = responses[0];
                $scope.topRecipes = responses[1];
            })
            .catch(function () {
                $scope.hasLatestRecipesError = true;
                $scope.hasTopRecipesError = true;
            })
            .finally(function() {
                $scope.isBusy = false;
            });
	};

	$scope.search = function() {
		$state.go('search', { query: $scope.searchQuery });
	};

	$scope.showRecipe = function(recipe) {
		$state.go('recipe', { recipeId: recipe.id });
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