import template from './component.tpl.html';
import AlGuestlistEditorComponentController from './controller';

/** Include sub components */
import './pages/emails/component';
import './pages/fields/component';
import './pages/general/component';
import './pages/form/component';
import './pages/general/component';
import './pages/landing/component';
import './pages/limits/component';
import './pages/tickets/component';
import './general/form-field-selector/component';
import './general/limit-configurator/component';

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
 <al-guestlist-editor guestlist="{}"></al-guestlist-editor>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alGuestlistEditor', {
        bindings: {
            guestlist: '<',
            onModelUpdate: '&',
            externalViewTrigger: '<'
        },
        controller: AlGuestlistEditorComponentController,
        controllerAs: 'vm',
        templateUrl: template
    });
