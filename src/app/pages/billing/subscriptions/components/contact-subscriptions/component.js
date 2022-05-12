import template from './views/component.tpl.html';
import './controllers/component';

/**
 * @ngdoc object
 * @name billing.subscriptions
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .component('contactSubscriptions', {
        templateUrl: template,
        controllerAs: 'vm',
        controller: 'ContactSubscriptionsComponentController',
        bindings: {
            contactId: '='
        }
    });