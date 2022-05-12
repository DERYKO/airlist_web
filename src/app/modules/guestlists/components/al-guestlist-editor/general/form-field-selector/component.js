import template from './views/component.tpl.html';
import AlGuestlistFormFieldSelectorComponentController from './controllers/component';

/**
 * @ngdoc component
 * @name airlst.modules.guestlists.component:al-guestlist-editor
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="airlst.modules.guestlists">
 <file name="index.html">
 <al-guestlist-form-field-selector guestlist="{}"></al-guestlist-form-field-selector>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alGuestlistFormFieldSelector', {
        bindings: {
            guestlist: '<',
            currentDefinition: '<',
            availableFields: '<',
            onDefinitionUpdate: '&',
            globalSelectedFields: '<',
            idPrefix: '<',
            customFieldDefinitions: '<',
            onCustomFieldChange: '&',
            simpleVersion: '<'
        },
        controller: AlGuestlistFormFieldSelectorComponentController,
        controllerAs: 'vm',
        templateUrl: template
    });
