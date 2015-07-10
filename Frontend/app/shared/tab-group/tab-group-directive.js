recipeRepoDirectives.directive('rdTabGroup', function($window) {
	return {
    	restrict: 'E',
		link: function(scope, elem) {
			elem.on('click', 'li', function() {
				elem.find('li').removeClass('active');
		    	$(this).addClass('active');
		 	});
		 },
    	templateUrl: '/app/shared/tab-group/_tab-group.html'
	};
});