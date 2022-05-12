import template from './component.tpl.html';
import './controller';

/**
 * @ngdoc component
 * @name theme.airlst.component:alPagination
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <al-pagination></al-pagination>
 *
 */
angular
    .module('airlst.theme.airlst')
    .component('alPagination', {
        templateUrl: template,
        controllerAs: 'pagination',
        controller: 'AlPaginationCtrl',
        bindings: {
            store: '='
        }
    });