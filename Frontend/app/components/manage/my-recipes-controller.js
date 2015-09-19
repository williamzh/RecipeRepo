recipeRepoControllers.controller('myRecipesController', ['$scope', 'apiClient', 'userSession', function($scope, apiClient, userSession) {
	apiClient.getRecipes()
		.then(function(recipes) {
			var user = userSession.get().user;
			var userRecipes = recipes.findAll(function(r) { 
				return user.ownedRecipes.indexOf(r.id) > -1; 
			});

			$scope.recipes = userRecipes.sortBy(function(r) { 
				return Date.create(r.meta.created); 
			}, true);
		})
		.catch(function() {
			// TODO: show error
		});
}]);