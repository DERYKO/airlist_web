import template from './component.tpl.html';
import AlGuestlistEditorComponentController from './controller';

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
 <al-guestlist-editor-page-fields guestlist="{}"></al-guestlist-editor-page-fields>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alGuestlistEditorPageFields', {
        bindings: {
            guestlist: '<',
            onModelUpdate: '&',
            availableFields: '<',
            globalModel: '<',
            showContent: '<',
            customFieldDefinitions: '<',
            onCustomFieldChange: '&',
            onEnabledFieldsUpdate: '&'
        },
        controller: AlGuestlistEditorComponentController,
        controllerAs: 'vm',
        templateUrl: template
    });
