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
 <al-guestlist-editor-page-general guestlist="{}"></al-guestlist-editor-page-general>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alGuestlistEditorPageGeneral', {
        bindings: {
            guestlist: '<',
            onModelUpdate: '&',
            globalModel: '<',
            showContent: '<'
        },
        controller: AlGuestlistEditorComponentController,
        controllerAs: 'vm',
        templateUrl: template
    });
