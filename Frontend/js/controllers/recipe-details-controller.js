angular.module('recipeRepoApp').controller('RecipeDetailsCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

	$http.get('http://localhost:8001/api/recipes/' + $routeParams.recipeId).then(function(response) {
		var recipe = response.data;

		if(!recipe) {
			// Show error - emit to main ctrl?
		}

		recipe.stars = convertRatingToStars(recipe.rating);

		$scope.recipe = recipe;
	}, function() {
		// Show error - emit to main ctrl?
	});
}]);

function convertRatingToStars(rating) {
	var ratings = [];
	for(var i = 1; i <= 5; i++) {
  		ratings.push({ isFilled: i <= rating });
	}

	return ratings;
}