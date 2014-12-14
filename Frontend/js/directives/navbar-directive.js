recipeRepoApp.directive('rdNavbar', function() {
	return {
    	restrict: 'A',
    	scope: {
      		backRoute: '@back'
		},
		controller: ['$scope', function($scope) {
			// TODO: inject authentication service
			$scope.isAuthenticated = true;	
		}],
    	templateUrl: 'partials/_navbar.html'
	};
});