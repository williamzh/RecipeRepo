recipeRepoApp.controller('ManageRecipeCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.onSubmit = function() {
		console.log("Submitted!");
	};

	// $http.get('http://localhost:8001/api/recipes/' + $routeParams.recipeId).then(function(result) {
	// 	var recipe = result.data;

	// 	if(!recipe) {
	// 		// Show error - emit to main ctrl?
	// 	}

	// 	$scope.recipe = recipe;
	// }, function() {
	// 	// Show error - emit to main ctrl?
	// });
}]);