import template from './dashboard-tabular-simple-directive.tpl.html';

/**
 * @ngdoc directive
 * @name contacts.directive:contact
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <contact model=''></contact>
 *
 */
angular
    .module('airlst.dashboard')
    .directive('dashboardTabularSimple', [
        dashboardTabularSimple
    ]);

function dashboardTabularSimple() {
    return {
        restrict: 'E',
        scope: {
            'groups': '=',
            'filters': '=',
            'aggregation': '=',
            'skipEmpty': '=',
            'model': '@',
            'headline': '@',
            'unit': '@',
            'empty': '@'
        },
        templateUrl: template,
        replace: false,
        controller: [
            'Statistics',
            dashboardTabularSimpleCtrl
        ],
        controllerAs: 'ctrl',
        bindToController: true
    };
}

function dashboardTabularSimpleCtrl(Statistics) {
    var vm = this;

    vm.data = [];

    vm.getStats = function () {
        Statistics.getCount(vm.model, vm.groups, vm.filters, vm.aggregation).then(function (stats) {
            vm.data = stats;
        }, function (error) {
            console.log('err', error);
        });
    };

    vm.getStats();
}