recipeRepoApp.controller('ManageRecipeCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.cuisines = [];

	$scope.ingredients = [];
	$scope.method = [];

   // Init

   $scope.cuisines.push();

   // End init

	$scope.addIngredient = function() {
		$scope.ingredients.push({});
	};

	$scope.removeIngredient = function(index) {
		$scope.ingredients.splice(index, 1);
	};

	$scope.addStep = function() {
		// Workaround. We use objects to get correct binding for string arrays: https://github.com/angular/angular.js/issues/1267
		$scope.method.push({});
	};

	$scope.removeStep = function(index) {
		$scope.method.splice(index, 1);
	};

	$scope.onSubmit = function(isValid) {
		console.log("Is valid: " + isValid);
		if(isValid) {
			// $http.post('http://localhost:8001/api/recipes/').then(function(result) {
			// 	console.log(result);
			// }, function() {
			// 	// Show error - emit to main ctrl?
			// });
		}
	};

	function formatData(formData) {
		return {
			"recipeId": "1",
               "recipeName": "Pasta Bolognese",
               "description": "En god pasta med morot och selleri",
               "imagePath": "/img/bolognese.jpg",
               "servingSize": 4,
               "isFavorite": true,
               "ingredients": [
                  {
                     "name": "köttfärs",
                     "quantity": "500",
                     "unit": "g"
                  },
                  {
                     "name": "krossade tomater",
                     "quantity": "400",
                     "unit": "g"
                  },
                  {
                     "name": "morötter",
                     "quantity": "2-3",
                     "unit": "st"
                  },
                  {
                     "name": "vitlök",
                     "quantity": "2",
                     "unit": "klyftor"
                  }
               ],
               "method": [
                  "Hacka löken och riv grönsakerna.",
                  "Fräs ca 5 min i olivolja, tillsätt sedan färsen och bryn den.",
                  "Tillsätt pressad vitlök samt de krossade tomaterna och tomatpurén.",
                  "Lägg i buljongen och krydda med salt och peppar.",
                  "Låt puttra i minst 20 min.",
                  "Tillsätt basilika och oregano, smaka av.",
                  "Koka upp pastan och rör ner den i såsen.",
                  "Låt småputtra i ca 5 min till, servera."
               ],
               "meta": {
                  "cuisine": "Italian",
                  "course": "Main",
                  "meal": "Dinner",
                  "category": "Pasta",
                  "rating": 4.5
               }
		};
	}
}]);