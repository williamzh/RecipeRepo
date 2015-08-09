recipeRepoControllers.controller('startController', ['$scope', '$state', 'apiClient', function($scope, $state, apiClient) {
	$scope.createSections = function() {
		apiClient.getRecipes()
			.then(function(recipes) {
				var filteredRecipes = recipes.findAll(function(r) { return !r.isPrivate; });
				$scope.startSections = generateSections(filteredRecipes);
			})
			.catch(function() {
				// TODO: show error
			});
	};

	function generateSections(recipes) {
		var topRatedSection = {
			name: 'topRated',
			items: recipes.sortBy(function(r) {
				return r.rating;
			}, true).to(4)
		};

		var latestSection = {
			name: 'latest',
			items: recipes.sortBy(function(r) {
				return Date.create(r.meta.created);
			}, true).to(4)
		};

		var historySection = {
			name: 'history',
			items: recipes.sortBy(function(r) {
				return Date.create(r.meta.lastViewed);
			}, true).to(4)
		};

		return [topRatedSection, latestSection, historySection];
	}
}]);