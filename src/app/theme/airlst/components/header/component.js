import template from './component.tpl.html';
import './controller';

/**
 * @ngdoc component
 * @name theme.airlst.component:header
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <layout-header></layout-header>
 *
 */
angular
    .module('airlst.theme.airlst')
    .component('layoutHeader', {
        templateUrl: template,
        controllerAs: 'header',
        controller: 'LayoutHeaderCtrl'
    });