/** @ngdoc object
 * @name tickets
 * @description
 *
 */
angular
    .module('airlst.tickets', [
        'ui.router',
        'airlst.components'
    ]);

require('./tickets-routes');

// Controllers
require('./controllers/list-controller');
require('./controllers/create-controller');
require('./controllers/details-controller');
require('./controllers/edit-controller');

// Directives
require('./directives/ticket/ticket-directive');
require('./directives/preview/preview-directive');

// Factories
require('./factories/ticket-factory');

// Workflows
require('./workflows/create-ticket');
require('./workflows/details/archive-pdf-ticket');
require('./workflows/details/delete-pdf-ticket');
require('./workflows/details/download-pdf-ticket');
require('./workflows/details/edit-pdf-ticket');
require('./workflows/details/restore-pdf-ticket');
