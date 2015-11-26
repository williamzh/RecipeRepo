recipeRepoDirectives.directive('rdNavbar', ['$window', function($window) {
	return {
    	restrict: 'AE',
		controller: ['$scope', '$state', 'userSession', function($scope, $state, userSession) {
			var checkIsAuthenticated = function() {
				$scope.isAuthenticated = userSession.isValid();
				if($scope.isAuthenticated) {
					$scope.user = userSession.get().user;
				}	
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
			var unbind = scope.$watch('isAuthenticated', function(newVal, oldVal) {
				if(newVal === true) {
					elem.find('.Header-toggleButton').on('click', function() {
						$('.Header-menu').toggleClass('is-open');
					});
					//unbind();
				}
			});
		},
    	templateUrl: '/app/shared/navbar/_navbar.html'
	};
}]);