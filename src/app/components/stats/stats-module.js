/**
 * @ngdoc object
 * @name components
 * @description
 *
 */
angular.module('airlst.components.stats', [
    'airlst.components'
]);

require('./components/billing/failed-payments/component');
require('./components/billing/latest-invoice-drafts/component');
require('./components/billing/invoices-paid-vs-open/component');

require('./components/contacts/subscription-counts/component');

require('./components/guestlists/failed-messages/component');
require('./components/guestlists/rsvps-by-status/component');
require('./components/guestlists/latest-state-changes/component');
require('./components/guestlists/invited-vs-confirmed/component');
