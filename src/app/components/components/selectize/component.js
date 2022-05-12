import template from './component.tpl.html';
import './controller';

/**
 * @ngdoc component
 * @name components.component:selectize
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="components">
 <file name="index.html">
 <selectize ng-model="" ng-disabled="" selectize-options="{}" on-change="" items="[]"></selectize>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .component('selectize', {
        bindings: {
            ngModel: '=',
            items: '<',
            ngDisabled: '<',
            selectizeOptions: '<',
            onChange: '&',
            maxItems: '<'
        },
        controller: 'ComponentsSelectizeController',
        controllerAs: 'vm',
        templateUrl: template
    });