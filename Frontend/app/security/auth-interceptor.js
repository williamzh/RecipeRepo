recipeRepoApp.factory('authInterceptor', ['$injector', '$q', 'userSession', function($injector, $q, userSession) {
	return {
        request: function(config) {
            var session = userSession.get();
            if (session && session.token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + session.token;
            }

            return config;
        },
        responseError: function(response) {
            if (response.status === 401) {
                userSession.dispose();
            	// Inject manually to avoid circular dependency
                $injector.get('$state').go('login');
                return $q.reject('User session has timed out.');
            }

            return $q.reject(response);
        }
    };
}]);