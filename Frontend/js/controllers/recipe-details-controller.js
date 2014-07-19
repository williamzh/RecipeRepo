angular.module('recipeRepoApp').controller('RecipeDetailsCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	var recipe = {
		name: "Spaghetti",
		description: 'A nice dish dsfsd',
		ingredients: [{
			name: 'Minced meat',
			quantity: 500,
			unit: 'g'
		}],
		imagePath: 'img/restaurant.jpg',
		preparation: ['One', 'Two']
	};

	recipe.stars = convertRatingToStars(recipe.rating);

	$scope.recipe = recipe;
}]);

function convertRatingToStars(rating) {
	var ratings = [];
	for(var i = 1; i <= 5; i++) {
  		ratings.push({ isFilled: i <= rating });
	}

	return ratings;
}