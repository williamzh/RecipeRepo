recipeRepoDirectives.directive('rdTabGroup', ['$rootScope', function($rootScope) {
	return {
    	restrict: 'E',
		link: function(scope, elem) {
			elem.on('click', 'li', function() {
				setActive($(this));
		 	});

		 	$rootScope.$on('$stateChangeSuccess', function(event, toState) {
		 		var target = elem.find('li').filter(function(i, el) {
		 			 return $(el).children('a').attr('ui-sref') == toState.name;
		 		});
		 		if(target.length) {
		 			setActive(target.eq(0));
		 		}

		 	});

		 	function setActive(el) {
		 		elem.find('li').removeClass('active');
		    	el.addClass('active');
		 	}
		 },
    	templateUrl: '/app/shared/tab-group/_tab-group.html'
	};
}]);