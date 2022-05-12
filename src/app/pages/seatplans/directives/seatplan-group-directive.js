import './seatplan-group-directive-controller';
import template from './seatplan-group-directive.tpl.html';

/**
 * @ngdoc directive
 * @name airlst.seatplans.directive:seatplan-group
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="airlst.seatplans">
 <file name="index.html">
 <seatplan-group></seatplan-group>
 </file>
 </example>
 *
 */
angular
    .module('airlst.seatplans')
    .directive('seatplanGroup', seatplanGroup);

function seatplanGroup() {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: 'SeatplanGroupCtrl',
        bindToController: {
            groupId: '@',
            clickable: '@',
            bookings: '@',
            onClick: '&',
            onDblClick: '&',
            onSelectionChange: '&',
            onUnSelectable: '&',
            bookingInformation: '=',
            blockedElements: '='
        }
    };
}