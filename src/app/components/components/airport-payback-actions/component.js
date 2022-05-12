import template from './component.tpl.html';
import './controller';
import './controllers/edit-information-modal-controller';
import './controllers/cancel-booking-modal-controller';

/**
 * @ngdoc component
 * @name components.component:al-switch
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="components">
 <file name="index.html">
 <airport-payback-actions rsvp="{}"></airport-payback-actions>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .component('airportPaybackActions', {
        bindings: {
            rsvp: '<',
            store: '<',
            updateAction: '&'
        },
        controller: 'AirportPaybackActionsController',
        controllerAs: 'vm',
        templateUrl: template
    });