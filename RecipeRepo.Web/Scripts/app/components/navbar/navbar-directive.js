recipeRepoDirectives.directive('rdNavbar', ['$timeout', function($timeout) {
	return {
    	restrict: 'AE',
		controller: ['$scope', '$state', 'userSession', function($scope, $state, userSession) {
			var checkIsAuthenticated = function() {
				$scope.isAuthenticated = userSession.isValid();
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
					var header = $('.Header');
					var headerMenu = $('.Header-menu');

					elem.find('.Header-toggleButton').on('click', function() {
						header.toggleClass('is-expanded');
						headerMenu.toggleClass('is-open');

						if(header.hasClass('is-expanded')) {
							$('body').css({ 'overflow': 'hidden' });
						}
						else {
							$('body').removeAttr("style");
						}
					});
					
					elem.on('click', '.Header-menuItem, .Header-brand', function() {
						// Close menu when menu item/brand is clicked
						headerMenu.removeClass('is-open');
						header.removeClass('is-expanded');
						$('body').removeAttr("style");
					});
				}
			});
		},
    	templateUrl: '/Scripts/app/components/navbar/_navbar.html'
	};
}]);