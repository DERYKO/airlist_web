import template from './component.tpl.html';
import './controller';

/**
 * @ngdoc component
 * @name theme.airlst.component:alTopSearch
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <al-top-search></al-top-search>
 *
 */
angular
    .module('airlst.theme.airlst')
    .component('alTopSearch', {
        templateUrl: template,
        controllerAs: 'vm',
        controller: 'AlTopSearchCtrl'
    });