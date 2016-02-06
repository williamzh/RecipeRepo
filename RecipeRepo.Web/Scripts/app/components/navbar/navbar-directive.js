recipeRepoDirectives.directive('rdNavbar', ['$timeout', function($timeout) {
	return {
    	restrict: 'AE',
    	controller: ['$scope', '$state', 'userSession', 'apiClient', function ($scope, $state, userSession, apiClient) {
			var checkIsAuthenticated = function() {
			    $scope.isAuthenticated = userSession.isValid();

                if ($scope.isAuthenticated) {
                    apiClient.getUser()
                        .then(function(user) {
                            $scope.loggedInUser = user.firstName + ' ' + user.lastName;
                        });
                }
			}

			checkIsAuthenticated();

			$scope.$on('userSessionInitialized', checkIsAuthenticated);
			$scope.$on('userSessionDisposed', checkIsAuthenticated);
			
			$scope.logout = function () {
			    // Add a slight delay to allow the is-expanded class to be removed before 
			    // hiding the header menu items
			    $timeout(function() {
			        userSession.dispose();
			        $state.go('login');
			    }, 50);
			};
		}],
		link: function(scope, elem, attrs) {
			scope.$watch('isAuthenticated', function(newVal, oldVal) {
				if(newVal === true) {
					var headerMenu = $('.Header-menu');

					elem.find('.Header-toggleButton').on('click', function() {
						headerMenu.toggleClass('is-open');

						if(headerMenu.hasClass('is-open')) {
							$('body').css({ 'overflow-y': 'hidden' });
						}
						else {
							$('body').removeAttr("style");
						}
					});
					
					elem.on('click', '.Header-menuItem, .Header-brand', function() {
						// Close menu when menu item/brand is clicked
						headerMenu.removeClass('is-open');
						$('body').removeAttr("style");
					});
				}
			});
		},
    	templateUrl: '/Scripts/app/components/navbar/_navbar.html'
	};
}]);