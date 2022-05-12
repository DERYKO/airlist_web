import './seatplan-example-directive-controller';
import template from './seatplan-example-directive.tpl.html';

/**
 * @ngdoc directive
 * @name airlst.seatplans.directive:seatplan
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="airlst.seatplans">
 <file name="index.html">
 <seatplan-example></seatplan-example>
 </file>
 </example>
 *
 */
angular
    .module('airlst.seatplans')
    .directive('seatplanExample', seatplan);

function seatplan() {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: 'SeatplanExampleCtrl',
        bindToController: {
            seatplanId: '@',
            blockedElements: '='
        }
    };
}