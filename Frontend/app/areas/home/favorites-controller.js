recipeRepoControllers.controller('favoritesController', ['$scope', 'userSession', 'apiClient', function($scope, userSession, apiClient) {
	$scope.getFavoriteRecipes = function() {
		apiClient.getRecipes()
			.then(function(recipes) {
				var user = userSession.get().user;

				$scope.recipes = recipes.findAll(function(r) { return user.favoriteRecipes.indexOf(r.id) > -1; });
			})
			.catch(function() {
				// TODO: show error
			});
	};
}]);