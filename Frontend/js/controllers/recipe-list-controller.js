angular.module('recipeRepoApp').controller('RecipeListCtrl', ['$scope', '$http', function($scope, $http) {
	var x = $http.get('http://localhost:8001/api/recipes').success(function(data) {
		console.log(data);
	});

	var recipes = [{
		id: 1,
		name: "Spaghetti",
		description: 'A nice dish',
		rating: 3
	}];

	for(var i = 0; i < recipes.length; i++) {
		recipes[i].stars = convertRatingToStars(recipes[i].rating);
	}

	$scope.recipes = recipes;
}]);

function convertRatingToStars(rating) {
	var ratings = [];
	for(var i = 1; i <= 5; i++) {
  		ratings.push({ isFilled: i <= rating });
	}

	return ratings;
}
