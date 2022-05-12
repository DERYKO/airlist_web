import './views/rsvp-editors/light.tpl.html';
import './views/rsvp-editors/full.tpl.html';

/* @ngdoc object
 * @name guestlists
 * @description
 *
 */
angular
    .module('airlst.guestlists', [
        'ui.router',
        'airlst.components'
    ]);

require('./guestlists-routes');

// Controllers
require('./controllers/guestlists/guestlist-edit-controller');
require('./controllers/guestlists/guestlists-create-controller');
require('./controllers/guestlists/guestlists-lists-controller');
require('./controllers/guestlists/guestlists-seats-controller');
require('./controllers/guestlists/guestlists-settings-controller');
require('./controllers/guestlists/limits-controller');

require('./controllers/rsvps/rsvps-create-controller');
require('./controllers/rsvps/rsvps-details-controller');
require('./controllers/rsvps/rsvps-edit-controller');
require('./controllers/rsvps/rsvps-import-controller');
require('./controllers/rsvps/rsvps-list-controller');
require('./controllers/rsvps/rsvps-masterlist-controller');
require('./controllers/rsvps/rsvps-multiple-edit-controller');
require('./controllers/rsvps/rsvps-duplicates-controller');
require('./controllers/rsvps/store/extended-listview');
require('./controllers/rsvps/store/duplicates-extended-listview');

// Directives
require('./directives/checkin/checkin-directive');
require('./components/messages/rsvp-messages');
require('./components/extended-info/rsvp-extended-info');
require('./components/rsvp-guests-full/component');

// Factories
require('./factories/guestlist/guestlist-factory');
require('./factories/rsvp/rsvp-factory');
require('./factories/checkin-factory');

// Services
require('./services/guestlist-action-service');

// Store
require('./store/guestlists');
require('./store/rsvps');
require('./store/rsvp-duplicates');

// Workflows
require('./workflows/general/create-rsvp');
require('./workflows/general/add-rsvp-to-guestlists');
require('./workflows/general/add-rsvps-to-categories');
require('./workflows/general/add-rsvps-to-picklists');
require('./workflows/general/add-to-addressbook');
require('./workflows/general/archive-selected-rsvps');
require('./workflows/general/export-files');
require('./workflows/general/export-rsvps');
require('./workflows/general/export-all-rsvps');
require('./workflows/general/import-rsvps');
require('./workflows/general/genderize-rsvps');
require('./workflows/general/duplicate-guestlist');
require('./workflows/general/duplicate-guestlists');
require('./workflows/general/merge-selected-rsvps');
require('./workflows/general/masterlist');
require('./workflows/general/remove-rsvps-from-categories');
require('./workflows/general/remove-rsvps-from-picklists');
require('./workflows/general/send-rsvp-email');
require('./workflows/general/send-rsvp-sms');
require('./workflows/general/update-rsvps');
require('./workflows/general/view-bookings');
require('./workflows/general/view-seatmap');
require('./workflows/general/email-rsvps');
require('./workflows/general/edit-guestlist-settings');
require('./workflows/general/guestlist-landing-link');
require('./workflows/heart-me/quick-add-contact');
require('./workflows/general/detailed/edit-rsvp');
require('./workflows/general/detailed/archive-rsvp');
require('./workflows/general/detailed/restore-rsvp');
require('./workflows/general/detailed/delete-rsvp');
require('./workflows/general/detailed/email-rsvp');
require('./workflows/general/detailed/sms-rsvp');
require('./workflows/general/detailed/add-rsvp-to-addressbook');
require('./workflows/general/detailed/checkin-rsvp');
require('./workflows/general/create-guestlist');

require('./workflows/general/rsvps-list/toggle-guest-mode');
require('./workflows/general/rsvps-list/show-duplicates');
require('./workflows/general/rsvps-list/guestlist-limits');
require('./workflows/general/rsvps-list/update-status');
