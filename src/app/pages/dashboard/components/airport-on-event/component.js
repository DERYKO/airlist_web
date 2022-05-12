import template from './component.tpl.html';
import './controller';

angular
    .module('airlst.dashboard')
    .component('dashboardAirportOnEvent', {
        bindings: {
            
        },
        controller: 'AirportOnEventDashboardController',
        controllerAs: 'vm',
        templateUrl: template
    });