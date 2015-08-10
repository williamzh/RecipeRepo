recipeRepoDirectives.directive('rdBackLink', ['$window', '$state', function($window, $state) {
    return {
        restrict: 'AE',
        scope: {
            targetState: '@',
            targetParams: '=?'
        },
        link: function(scope, elem) {
            elem.on('click', function() {
                if(scope.targetState) {
                    console.log(scope.targetState, scope.targetParams);
                    $state.go(scope.targetState, scope.targetParams);
                }
                else {
                    $window.history.back();
                }
            });
        },
        template: '<a class="back"><i class="fa fa-chevron-left"></i> <rd-translate key="global/backLabel"></rd-translate></a>'
    }
}]);