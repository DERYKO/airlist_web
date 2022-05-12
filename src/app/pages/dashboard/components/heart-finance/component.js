import template from './component.tpl.html';
import './controller';

angular
    .module('airlst.dashboard')
    .component('dashboardHeartFinance', {
        bindings: {
            
        },
        controller: 'HeartFinanceDashboardController',
        controllerAs: 'vm',
        templateUrl: template
    });