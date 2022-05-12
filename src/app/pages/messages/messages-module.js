/**
 * @ngdoc object
 * @name messages
 * @description
 */
angular
    .module('airlst.messages', [
        'ui.router',
        'airlst.components'
    ]);

require('./messages-routes');

// Controllers
require('./controllers/messages-create-controller');
require('./controllers/messages-details-controller');
require('./controllers/messages-lists-controller');

// Directives
require('./directives/messages/message-directive');

// Factories
require('./factories/message-factory');
require('./store/messages');

// Workflows
require('./workflows/general/export-messages');
require('./workflows/general/create-message');
require('./workflows/general/view-message');
require('./workflows/general/delete-message');
require('./workflows/general/restore-message');
require('./workflows/general/archive-message');