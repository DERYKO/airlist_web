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
 <al-guestlist-editor-page-tickets guestlist="{}"></al-guestlist-editor-page-tickets>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alGuestlistEditorPageTickets', {
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
