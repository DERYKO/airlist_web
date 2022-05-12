/**
 * @ngdoc object
 * @name settings
 * @description
 *
 */
angular
    .module('airlst.settings', [
        'ui.router',
        'airlst.components'
    ]);

require('./settings-routes');

// Controllers
require('./controllers/blacklists-controller');
require('./controllers/customs-controller');
require('./controllers/notifications-controller');
require('./controllers/profile-details-controller');
require('./controllers/profile-edit-controller');

// Factories
require('./factories/setting-factory');

// Workflows
require('./workflows/profile/edit-profile');
