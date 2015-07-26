recipeRepoControllers.controller('startController', ['$scope', '$state', 'apiClient', function($scope, $state, apiClient) {
	$scope.createSections = function() {
		apiClient.getRecipes()
			.then(function(recipes) {
				$scope.startSections = generateSections(recipes);
			})
			.catch(function() {
				// TODO: show error
			});
	};

	function generateSections(recipes) {
		var historySection = {
			name: 'history',
			items: recipes.sortBy(function(r) {
				return Date.create(r.meta.lastViewed);
			}, true).to(4)
		};

		var latestSection = {
			name: 'latest',
			items: recipes.sortBy(function(r) {
				return Date.create(r.created);
			}, true).to(4)
		};

		var topRatedSection = {
			name: 'topRated',
			items: recipes.sortBy(function(r) {
				return Date.create(r.rating);
			}, true).to(4)
		};

		return [historySection, latestSection, topRatedSection];
	}
}]);