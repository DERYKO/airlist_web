/**
 * @ngdoc directive
 * @name components.directive:country-name
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="airlst.components">
 <file name="index.html">
 <country-name code=""></country-name>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .directive('countryName', [
        countryName
    ]);

function countryName() {
    return {
        restrict: 'EA',
        scope: {
            'code': '='
        },
        template: '<span class="country-flag flag-icon flag-icon-{{ vm.code | lowercase}} flag-icon-squared"></span><span class="country-name">{{vm.countryName}}</span>',
        controller: [
            '$scope',
            '$rootScope',
            function ($scope, $rootScope) {
                const vm = this;

                vm.countryName = '';
                vm.code = $scope.code;

                if ($scope.code) {
                    _.forEach($rootScope.deposit.countries, function (country) {
                        if (country.code === $scope.code.toUpperCase()) {
                            vm.countryName = country.name;
                        }
                    });
                }
            }
        ],
        controllerAs: 'vm'
    };
}