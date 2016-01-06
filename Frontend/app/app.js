var recipeRepoApp = angular.module('recipeRepoApp', [
	'ui.router',
	'ngStorage',
	'slugifier',
	'ui.sortable',
	'recipeRepoControllers',
	'recipeRepoDirectives',
	'recipeRepoServices',
	'recipeRepoFilters'
]);

var recipeRepoControllers = angular.module('recipeRepoControllers', []);
var recipeRepoDirectives = angular.module('recipeRepoDirectives', []);
var recipeRepoServices = angular.module('recipeRepoServices', []);
var recipeRepoFilters = angular.module('recipeRepoFilters', []);

recipeRepoApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
}]);

recipeRepoApp.run(['localizationInitializer', 'userSession', function(localizationInitializer, userSession) {
	localizationInitializer.load();

	if(userSession.isValid()) {
		moment.locale(userSession.get().userLang);
	}
}]);