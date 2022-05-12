/**
 * @ngdoc directive
 * @name components.directive:ngEnter
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 *
 */
angular
    .module('airlst.components')
    .directive('ngEnter', [
        ngEnter
    ]);

function ngEnter() {
    return {
        link: function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    };
}