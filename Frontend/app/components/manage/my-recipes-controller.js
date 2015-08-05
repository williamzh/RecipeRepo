recipeRepoControllers.controller('myRecipesController', ['$scope', 'apiClient', 'userSession', function($scope, apiClient, userSession) {
	apiClient.getRecipes()
		.then(function(recipes) {
			var user = userSession.get().user;
			$scope.recipes = recipes.findAll(function(r) { return user.ownedRecipes.indexOf(r.id) > -1; });
		})
		.catch(function() {
			// TODO: show error
		});
}]);