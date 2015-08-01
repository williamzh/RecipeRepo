recipeRepoServices.service('userSession', ['$sessionStorage', function($sessionStorage) {
	this.isValid = function() {
        return $sessionStorage.authSession !== undefined && $sessionStorage.authSession.token !== undefined;
    };

    this.get = function() {
        return $sessionStorage.authSession;
    };

    this.initialize = function(authSession) {
        $sessionStorage.authSession = authSession;
    };
}]);