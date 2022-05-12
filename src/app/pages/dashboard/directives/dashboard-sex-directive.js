import template from './dashboard-sex-directive.tpl.html';

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
    .directive('dashboardSex', [
        dashboardSex
    ]);

function dashboardSex() {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'sexCtrl',
        controller: [
            'Statistics',
            dashboardSexCtrl
        ],
        bindToController: true
    };
}

function dashboardSexCtrl(Statistics) {
    var vm = this;

    vm.data = [];
    vm.labels = [];

    vm.getStats = function () {
        Statistics.getSex().then(function (stats) {
            vm.data = _.values(stats);
            vm.labels = _.keys(stats);
        }, function (error) {
            console.log('err', error);
        });
    };

    vm.getStats();

    return vm;
}