recipeRepoApp.controller('ManageRecipeCtrl', ['$scope', 'apiClient', function($scope, apiClient) {

   init();

   function init() {
      $scope.ingredients = [];
      $scope.method = [];
      $scope.showSuccessAlert = false;

      apiClient.requestMany(apiClient.getMetainfoValues('cuisine'), apiClient.getMetainfoValues('category')).then(function(results) {
         $scope.cuisines = results[0];
         $scope.categories = results[1];
      });
   }

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
			var recipe = formatData($scope.recipeForm);
			// apiClient.addRecipe(recipe).then(function() {
			// 	$scope.showSuccessAlert = true;
			// });
		}
	};

	$scope.hasError = function(field) {
 		var isInvalid = $scope.recipeForm[field].$invalid;
		return ($scope.recipeForm[field].$dirty && isInvalid) || ($scope.submitted && isInvalid);
	};

	function formatData(formData) {
		return {
			recipeName: formData.name.$modelValue,
			description: formData.description.$modelValue,
			imagePath: formData.imagePath.$modelValue,
			servingSize: formData.servings.$modelValue,
			isFavorite: formData.isFavorite.$modelValue,
			ingredients: $scope.ingredients.map(function(ing) { 
				return {
					name: ing.name,
					quantity: ing.quantity,
					unit: ing.unit
				};
			}),
			method: $scope.method.map(function(step) {
				return step.value;
			}),
			meta: {
			  cuisine: formData.cuisine.$modelValue,
			  //course: "Main",
			  category: formData.category.$modelValue,
			  rating: formData.rating.$modelValue
			}
		};
	}
}]);