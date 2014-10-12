angular.module('recipeRepoApp').controller('RecipeListCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('http://localhost:8001/api/recipes?groupBy=category').then(function(result) {

		// for(var i = 0; i < recipes.length; i++) {
		// 	recipes[i].stars = convertRatingToStars(recipes[i].rating);
		// }

		$scope.categories = result.data;
	});	
}]);

function convertRatingToStars(rating) {
	var ratings = [];
	for(var i = 1; i <= 5; i++) {
  		ratings.push({ isFilled: i <= rating });
	}

	return ratings;
}
