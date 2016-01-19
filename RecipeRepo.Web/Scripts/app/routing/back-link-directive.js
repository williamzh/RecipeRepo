recipeRepoDirectives.directive('rdBackLink', ['$window', '$state', function($window, $state) {
    return {
        restrict: 'AE',
        scope: {
            targetState: '@?',
            targetParams: '=?'
        },
        link: function(scope, elem) {
            elem.on('click', function() {
                if(scope.targetState) {
                    $state.go(scope.targetState, scope.targetParams);
                }
                else {
                    $window.history.back();
                }
            });
        },
        template: '<a href="#" class="Button--link"><i class="fa fa-chevron-left"></i> {{"global/backLabel" | translate}}</a>'
    }
}]);