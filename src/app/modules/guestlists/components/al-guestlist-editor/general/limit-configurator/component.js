import template from './views/component.tpl.html';
import AlGuestlistLimitConfiguratorComponentController from './controllers/component';

/**
 * @ngdoc component
 * @name airlst.modules.guestlists.component:al-guestlist-limit-configurator
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module="airlst.modules.guestlists">
 <file name="index.html">
 <al-guestlist-limit-configurator guestlist="{}"></al-guestlist-limit-configurator>
 </file>
 </example>
 *
 */
angular
    .module('airlst.modules.media')
    .component('alGuestlistLimitConfigurator', {
        bindings: {
            guestlist: '<',
            currentLimits: '<',
            onLimitsUpdate: '&'
        },
        controller: AlGuestlistLimitConfiguratorComponentController,
        controllerAs: 'vm',
        templateUrl: template
    });
