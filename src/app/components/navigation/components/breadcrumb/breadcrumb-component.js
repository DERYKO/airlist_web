import template from './views/component.tpl.html';
import './controllers/component-controller';

/**
 * @ngdoc component
 * @name navigation.component:navigation-breadcrumb
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <navigation-breadcrumb></navigation-breadcrumb>
 *
 */
angular
    .module('airlst.components')
    .component('navigationBreadcrumb', {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: 'BreadcrumbComponentController'
    });