recipeRepoServices.service('userSession', ['$rootScope', '$sessionStorage', function($rootScope, $sessionStorage) {
	this.isValid = function() {
        return $sessionStorage.authSession !== undefined;
    };

    this.get = function() {
        return $sessionStorage.authSession;
    };

    this.initialize = function(authResponse) {
        $sessionStorage.authSession = {
            token: authResponse.access_token,
            userId: authResponse.userId,
            userLang: authResponse.lang
        };
        $rootScope.$broadcast('userSessionInitialized');        
    };

    this.dispose = function() {        
    	delete $sessionStorage.authSession;
        $rootScope.$broadcast('userSessionDisposed');
    };
}]);