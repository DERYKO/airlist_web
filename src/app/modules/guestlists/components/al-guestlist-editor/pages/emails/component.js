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
 <al-guestlist-editor-page-emails guestlist="{}"></al-guestlist-editor-page-emails>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alGuestlistEditorPageEmails', {
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
