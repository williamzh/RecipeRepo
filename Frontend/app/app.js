var recipeRepoApp = angular.module('recipeRepoApp', [
	'ui.router',
	'ngStorage',
	'slugifier',
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

	var session = userSession.get();
	if(session) {
		var userLocale = session.user.settings.language;
		moment.locale(userLocale);
	}
}]);