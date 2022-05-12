import template from './component.tpl.html';
import './controller';
import DekraDashboardController from './controller';

angular
    .module('airlst.dashboard')
    .component('dashboardDekra', {
        bindings: {

        },
        controller: DekraDashboardController,
        controllerAs: 'vm',
        templateUrl: template
    });
