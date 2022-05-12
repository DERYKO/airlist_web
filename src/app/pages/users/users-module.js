/**
 * @ngdoc object
 * @name users
 * @description
 *
 */
angular
    .module('airlst.users', [
        'ui.router',
        'airlst.components'
    ]);

require('./users-routes');

// Controllers
require('./controllers/users-list-controller');
require('./controllers/users-create-controller');
require('./controllers/users-details-controller');
require('./controllers/users-edit-controller');
require('./controllers/modals/invite-email-modal-controller');

// Factories
require('./factories/user-factory');


//Workflows
require('./workflows/invite-user');
require('./workflows/view-user');
