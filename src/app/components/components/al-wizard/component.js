import template from './component.tpl.html';
import './controller';

/**
 * @ngdoc component
 * @name components.component:al-wizard
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="components">
 <file name="index.html">
 <al-wizard steps="[]" on-change="vm.update(selectedStep)"></al-wizard>
 </file>
 </example>
 *
 */
angular
    .module('airlst.components')
    .component('alWizard', {
        bindings: {
            steps: '<',
            onChange: '&'
        },
        controller: 'ComponentsAlWizardController',
        controllerAs: 'vm',
        templateUrl: template
    });