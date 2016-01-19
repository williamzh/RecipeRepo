recipeRepoDirectives.directive('modal', ['$log', function($log) {
	return {
    	restrict: 'E',
    	transclude: true,
    	scope: {
    		onClose: '&'
    	},
		templateUrl: '/Scripts/app/components/modal/_modal.html'
	};
}]);