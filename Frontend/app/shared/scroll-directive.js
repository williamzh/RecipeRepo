recipeRepoDirectives.directive('rdScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, $elem, $attr) {
            $elem.on('click', function() {
                var scrollPosition;

                switch($attr.scrollTarget) {
                    case 'top':
                        scrollPosition = $('body').offset().top;
                        break;
                    case 'self':
                        scrollPosition = $elem.offset().top;
                        break;
                    default:
                        throw new Error('Invalid scroll target ' + scope.target + '.');
                }

                $("body").animate({ scrollTop: scrollPosition }, 300);
            });
        }
    }
});