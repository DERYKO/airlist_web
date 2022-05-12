import template from './checkin-directive.tpl.html';
import './checkin-directive-controller';

/**
 * @ngdoc directive
 * @name rsvps.directive:checkin
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 * <checkin model=''></checkin>
 *
 */
angular
    .module('airlst.guestlists')
    .directive('checkin', checkin);

function checkin() {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: 'CheckinCtrl',
        bindToController: {
            model: '=',
            manager: '=',
            onUpdate: '&',
            onHide: '&',
            onArchive: '&',
            onSet: '&'
        }
    };
}