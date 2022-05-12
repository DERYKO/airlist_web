import fullTemplate from './views/editors/full.tpl.html';
import './views/editors/light.tpl.html';

/**
 * @ngdoc object
 * @name contacts
 * @description
 *
 */
angular
    .module('airlst.contacts', [
        'ui.router'
    ]);

require('./contacts-routes');

// Controllers
require('./controllers/contact-edit-controller');
require('./controllers/contacts-details-controller');
require('./controllers/contact-create-controller');
require('./controllers/contacts-multiple-editor-controller');
require('./controllers/contacts-import-controller');
require('./controllers/contacts-list-controller');
require('./controllers/contacts-duplicate-controller');
require('./controllers/contacts-duplicates-controller');
require('./controllers/store/extended-listview');

// Factories
require('./factories/contact-factory');
require('./store/contacts');

// Workflows
require('./workflows/list-view/create-contact');
require('./workflows/list-view/view-contact');
require('./workflows/list-view/add-category');
require('./workflows/list-view/add-to-guestlist');
require('./workflows/list-view/add-contacts-to-picklists');
require('./workflows/list-view/export-contacts');
require('./workflows/list-view/export-all-contacts');
require('./workflows/list-view/genderize-contacts');
require('./workflows/list-view/merge-selected');
require('./workflows/list-view/remove-category');
require('./workflows/list-view/remove-from-picklist');
require('./workflows/list-view/email-contacts');
require('./workflows/list-view/send-sms');
require('./workflows/list-view/to-grid-view');
require('./workflows/list-view/update-selected');
require('./workflows/list-view/import-contacts');
require('./workflows/list-view/duplicate-contacts');
require('./workflows/list-view/review-duplicates');
require('./workflows/list-view/quick-create-contact');

require('./workflows/heart-me/change-status-and-send-email');

require('./directives/sections/address/contact-address');
require('./directives/sections/card/contact-card');
require('./directives/sections/additional/contact-additional');
require('./directives/sections/active-subscriptions/active-subscriptions');
require('./directives/sections/social-profiles/social-profiles');
require('./directives/sections/extended-info/contact-extended-info');
require('./directives/sections/documents/contact-documents');
require('./directives/sections/subscriptions/contact-subscriptions');
require('./directives/sections/rsvps/contact-rsvps');
require('./directives/sections/invoices/contact-invoices');
require('./directives/sections/checkins/contact-checkins');
require('./directives/sections/messages/contact-messages');
require('./directives/sections/picklists/contact-picklists');

require('./workflows/detailed-view/add-nfc-tag');
require('./workflows/detailed-view/checkin-contacts');
require('./workflows/detailed-view/edit-contact');
require('./workflows/detailed-view/test-selective');
require('./workflows/detailed-view/add-contact-to-category');
require('./workflows/detailed-view/add-contact-to-guestlist');
require('./workflows/detailed-view/add-contact-to-picklists');
require('./workflows/detailed-view/remove-contact-from-picklist');
require('./workflows/detailed-view/remove-contact-from-category');
require('./workflows/detailed-view/archive-contact');
require('./workflows/detailed-view/restore-contact');
require('./workflows/detailed-view/delete-contact');
require('./workflows/detailed-view/sms-contact');
require('./workflows/detailed-view/email-contact');
