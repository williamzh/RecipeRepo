recipeRepoControllers.controller('myRecipesController', ['$scope', 'apiClient', '$q', function($scope, apiClient, $q) {
	$scope.ownedRecipes = [];
	$scope.favoriteRecipes = [];

	$scope.currentOwnedRecipe = null;
	$scope.currentFavoriteRecipe = null;

	$scope.init = function () {
	    $scope.isBusy = true;

		apiClient.getUser()
			.then(function(user) {
				return $q.all([apiClient.getRecipes(user.ownedRecipes), apiClient.getRecipes(user.favoriteRecipes)]);
			})
			.then(function(responses) {
				$scope.ownedRecipes = responses[0];
				$scope.favoriteRecipes = responses[1];

				$scope.hasError = false;
			})
			.catch(function() {
				$scope.hasError = true;
			})
	        .finally(function() {
		        $scope.isBusy = false;
		    });
	};

	$scope.showRemoveRecipeConfirmation = function(recipe) {
		$scope.removeRecipeModalVisible = true;
		$scope.currentOwnedRecipe = recipe;
	};

	$scope.removeRecipe = function() {
		apiClient.removeRecipe($scope.currentOwnedRecipe.id)
			.then(function() {
				$scope.removeRecipeModalVisible = false;
				$scope.currentOwnedRecipe = null;
				$scope.hasRemoveRecipeError = false;

				return $scope.init();
			})
			.catch(function() {
				$scope.hasRemoveRecipeError = true;
			});
	};

	$scope.showRemoveFavoriteConfirmation = function(recipe) {
		$scope.removeFavoriteModalVisible = true;
		$scope.currentFavoriteRecipe = recipe;
	};

	$scope.removeFavorite = function() {
		apiClient.removeFavorite($scope.currentFavoriteRecipe.id)
			.then(function() {
				$scope.removeFavoriteModalVisible = false;
				$scope.currentFavoriteRecipe = null;
				$scope.hasRemoveFavoriteError = false;

				return $scope.init();
			})
			.catch(function() {
				$scope.hasRemoveFavoriteError = true;
			});
	};
}]);