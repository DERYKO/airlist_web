/**
 * @ngdoc object
 * @name picklists
 * @description
 *
 */
angular
    .module('airlst.picklists', [
        'ui.router',
        'airlst.components'
    ]);

require('./picklists-routes');

// Controllers
require('./controllers/contacts/contacts-details-controller');
require('./controllers/contacts/contacts-list-controller');
require('./controllers/picklists/details-controller');
require('./controllers/picklists/edit-controller');
require('./controllers/picklists/create-controller');
require('./controllers/picklists/lists-controller');

// Factories
require('./factories/picklist/picklist-factory');

// Workflow
require('./workflows/general/add-contacts-to-picklist');
require('./workflows/general/archive-picklist');
require('./workflows/general/delete-picklist');
require('./workflows/general/remove-duplicate-picklist-contacts');
require('./workflows/general/remove-from-this-picklist');
require('./workflows/general/show-picklist-contact');
require('./workflows/general/show-picklist-settings');

require('./workflows/list/create-picklist');
require('./workflows/list/show-picklist-contacts');
