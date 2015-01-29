recipeRepoDirectives.directive('rdScroll', function() {
  return {
    restrict: 'A',
    scope: {
      target: '=?'
    },
    link: function(scope, $elm) {
		$elm.on('click', function() {
			$("body").animate({ scrollTop: $elm.offset().top }, "slow");
		});
    }
  }
});