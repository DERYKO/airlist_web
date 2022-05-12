import template from './views/component.tpl.html';
import './controllers/component-controller';

/**
 * @ngdoc component
 * @name navigation.component:navigation-topnav
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <navigation-topnav></navigation-topnav>
 *
 */
angular
    .module('airlst.components')
    .component('navigationTopNav', {
        restrict: 'E',
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: 'TopNavComponentController',
        bindings: {
            navIsMobile: '='
        }
    });