recipeRepoDirectives.directive('modal', ['$log', function($log) {
	return {
    	restrict: 'E',
    	transclude: true,
    	scope: {
            isVisible: '='
    	},
		templateUrl: '/Scripts/app/components/modal/_modal.html'
	};
}]);