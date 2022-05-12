/**
 * @ngdoc directive
 * @name components.directive:custom-view
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="airlst.components">
 <file name="index.html">
 <custom-view template="" default=""></custom-view>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .directive('customView', [
        '$templateCache',
        customView
    ]);

function customView($templateCache) {
    var deps = {$templateCache: $templateCache};
    return {
        restrict: 'EA',
        scope: false,
        template: '<ng-include src="view"></ng-include>',
        link: angular.bind(deps, loadView)
    };
}

function loadView(scope, element, attr) {
    scope.view = this.$templateCache.get(attr.template) ? attr.template : attr.default;
}
