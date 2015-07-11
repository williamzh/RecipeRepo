recipeRepoDirectives.directive('rdBackLink', ['$window', '$state', function($window, $state) {
    return {
        restrict: 'AE',
        scope: {
            targetState: '@?',
            targetParams: '=?'
        },
        link: function(scope, elem) {
            elem.on('click', function() {
                if(!scope.targetState) {
                    $window.history.back();
                    return;
                }

                $state.go(scope.targetState, scope.targetParams);
            });
        },
        template: '<a class="back"><i class="fa fa-chevron-left"></i> Back</a>'
    }
}]);