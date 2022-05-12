import template from './component.tpl.html';
import './controller';

/**
 * @ngdoc component
 * @name components.component:al-switch
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="components">
 <file name="index.html">
 <al-switch config="{}" model="" on-change="vm.changedSlider(newVal)"></al-switch>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .component('alSwitch', {
        bindings: {
            model: '=',
            config: '<',
            onChange: '&'
        },
        controller: 'ComponentsAlSwitchController',
        controllerAs: 'vm',
        templateUrl: template
    });