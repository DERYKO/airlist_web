import template from './stats.tpl.html';
import './stats-controller';
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
    .module('airlst.statistics')
    .directive('stats', stats);

function stats() {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: 'StatisticsStatsCtrl',
        bindToController: {
            group: '@',
            source: '@',
            type: '@',
            params: '=',
            refreshIndex: '<',
            hideLegend: '='
        }
    };
}