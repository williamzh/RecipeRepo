recipeRepoDirectives.directive('rdNavbar', ['$window', function($window) {
	return {
    	restrict: 'A',
    	scope: {},
		controller: ['$scope', function($scope) {
			// TODO: inject authentication service
			$scope.isAuthenticated = true;	
		}],
		link: function(scope, elem, attrs) {
			elem.find('.back-btn').on('click', function() {
		    	$window.history.back();
		 	});
		 },
    	templateUrl: 'partials/_navbar.html'
	};
}]);