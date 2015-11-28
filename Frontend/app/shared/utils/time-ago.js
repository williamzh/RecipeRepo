recipeRepoFilters.filter('timeAgo', [function() {
	return function(input) {
		return moment(input).fromNow();
	};
}]);