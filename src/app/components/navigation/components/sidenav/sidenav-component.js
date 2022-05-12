import template from './views/component.tpl.html';
import './views/subItems.tpl.html';
import './controllers/component-controller';

/**
 * @ngdoc component
 * @name navigation.component:navigation-sidenav
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <navigation-sidenav></navigation-sidenav>
 *
 */
angular
    .module('airlst.components')
    .component('navigationSideNav', {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: 'SideNavComponentController'
    });
