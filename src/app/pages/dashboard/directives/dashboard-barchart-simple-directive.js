import template from './dashboard-barchart-simple-directive.tpl.html'

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
    .directive('dashboardBarchartSimple', [
        dashboardBarchartSimple
    ]);

function dashboardBarchartSimple() {
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
        controllerAs: 'ctrl',
        controller: [
            'Statistics',
            dashboardBarchartSimpleCtrl
        ],
        bindToController: true
    };
}

function dashboardBarchartSimpleCtrl(Statistics) {
    var vm = this;

    vm.data = [];
    vm.labels = [];
    vm.series = [];

    vm.getStats = function () {
        Statistics.getCount(vm.model, vm.groups, vm.filters, vm.aggregation).then(function (stats) {
            vm.data = [_.values(stats)];
            vm.labels = _.keys(stats);
            vm.series = ['A'];
        }, function (error) {
            console.log('err', error);
        });
    };

    vm.getStats();

    return vm;
}