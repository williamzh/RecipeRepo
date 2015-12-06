recipeRepoDirectives.directive('modal', ['$log', function($log) {
	return {
    	restrict: 'E',
    	transclude: true,
    	scope: {
    		onClose: '&'
    	},
		templateUrl: '/app/shared/modal/_modal.html'
	};
}]);