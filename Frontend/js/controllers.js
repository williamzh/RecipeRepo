var controllers = angular.module('appControllers', []);

/* 
 * -----------------------------------------------------------
 * 			Home Controller 
 * -----------------------------------------------------------
 */

controllers.controller('HomeCtrl', ['$scope', function($scope) {
	
}]);

/* 
 * -----------------------------------------------------------
 * 			Recipe Controllers 
 * -----------------------------------------------------------
 */

controllers.controller('RecipeListCtrl', ['$scope', '$http', function($scope, $http) {
	var x = $http.get('http://localhost:32951/api/recipes').success(function(data) {
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

controllers.controller('RecipeDetailsCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
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

/* 
 * -----------------------------------------------------------
 * 			Helpers 
 * -----------------------------------------------------------
 */

function convertRatingToStars(rating) {
	var ratings = [];
	for(var i = 1; i <= 5; i++) {
  	ratings.push({ isFilled: i <= rating });
	}

	return ratings;
}