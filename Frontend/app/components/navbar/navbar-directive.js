recipeRepoDirectives.directive('rdNavbar', ['$window', function($window) {
	return {
    	restrict: 'AE',
		controller: ['$scope', '$state', 'userSession', function($scope, $state, userSession) {
			var checkIsAuthenticated = function() {
				$scope.isAuthenticated = userSession.isValid();
			}

			checkIsAuthenticated();

			$scope.$on('userSessionInitialized', checkIsAuthenticated);
			$scope.$on('userSessionDisposed', checkIsAuthenticated);
			
			$scope.logout = function() {
				userSession.dispose();
				$state.go('login');
			};
		}],
		link: function(scope, elem, attrs) {
			scope.$watch('isAuthenticated', function(newVal, oldVal) {
				if(newVal === true) {
					var headerMenu = $('.Header-menu');

					elem.find('.Header-toggleButton').on('click', function() {
						headerMenu.toggleClass('is-open');
					});
					
					elem.on('click', '.Header-menuItem', function() {
						// Close menu when menu item is clicked
						headerMenu.removeClass('is-open');
					});
				}
			});
		},
    	templateUrl: '/app/components/navbar/_navbar.html'
	};
}]);