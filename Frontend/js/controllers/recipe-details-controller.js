angular.module('recipeRepoApp').controller('RecipeDetailsCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	var recipe = {
	  "id": 1,
	  "name": "Pasta Bolognese",
	  "description": "En god pasta med morot och selleri",
	  "imagePath": "~/Content/img/Brick and Mortar-Brick and Mortar-0003.jpg",
	  "ingredients": [{
	    "name": "Köttfärs",
	    "quantity": "500",
	    "unit": "g"
	  }, {
	    "name": "Krossade tomater",
	    "quantity": "400",
	    "unit": "g"
	  }, {
	    "name": "Morötter",
	    "quantity": "2-3",
	    "unit": "st"
	  }, {
	    "name": "Vitlök",
	    "quantity": "2",
	    "unit": "klyftor"
	  }],
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
	  "tags": [{
	    "type": "Cuisine",
	    "value": "Italian"
	  }, {
	    "type": "CourseType",
	    "value": "Main"
	  }, {
	    "type": "CourseType",
	    "value": "Dinner"
	  }]
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