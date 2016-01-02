recipeRepoControllers.controller('recipeDetailsController', ['$scope', '$stateParams', '$state', '$q', 'userSession', 'apiClient', function($scope, $stateParams, $state, $q, userSession, apiClient) {
	//$scope.previousState = $stateParams.referrer || 'home';

	$scope.initialize = function() {
		$q.all([apiClient.getRecipe($stateParams.recipeId), apiClient.getUser()])
			.then(function(responses) {
				var recipe = responses[0];
				$scope.recipe = formatRecipe(recipe);

				var user = responses[1];
				$scope.isFavorite = user.favoriteRecipes.indexOf($scope.recipe.id) > -1;
				$scope.isEditable = user.ownedRecipes.indexOf($scope.recipe.id) > -1;

				return apiClient.updateHistory(user.id, recipe.id);
			})
			.catch(function(errResponse) {
				$scope.hasError = true;
			});
	};

	$scope.onFavoriteClick = function(e) {
		var isFavorite = $scope.isFavorite;
		$scope.isFavorite = !$scope.isFavorite;
		if(isFavorite) {
			return;
		}

		var user = userSession.get().user;
		user.favoriteRecipes.push($scope.recipe.id);

		apiClient.updateUser(user.userName, user).then(function(response) {
			$scope.recipe.isFavorite = recipe.isFavorite;
		});
	};

	$scope.removeRecipe = function() {
		apiClient.removeRecipe($scope.recipe.id)
			.then(function() {
				$state.go('home');
			})
			.catch(function() {
				$scope.hasError = true;
			});
	};

	function formatRecipe(recipe) {
		recipe.groupedIngredients = recipe.ingredients.groupBy(function(ing) {
			return ing.component;
		});

		return recipe;
	}
}]);