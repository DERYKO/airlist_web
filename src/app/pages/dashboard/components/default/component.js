import template from './component.tpl.html';
import './controller';

angular
    .module('airlst.dashboard')
    .component('dashboardDefault', {
        bindings: {

        },
        controller: 'DashboardDefaultController',
        controllerAs: 'vm',
        templateUrl: template
    });