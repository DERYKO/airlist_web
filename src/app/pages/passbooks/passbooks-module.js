/**
 * @ngdoc object
 * @name passbooks
 * @description
 *
 */
angular
    .module('airlst.passbooks', [
        'ui.router',
        'airlst.components'
    ]);

require('./passbooks-routes');

// Controllers
require('./controllers/list-controller');
require('./controllers/create-controller');
require('./controllers/edit-controller');
require('./controllers/details-controller');

// Factories
require('./factories/passbook-factory');

// Workflows
require('./workflows/duplicate-passbook');
require('./workflows/create-passbook');
require('./workflows/details/archive-passbook');
require('./workflows/details/delete-passbook');
require('./workflows/details/download-passbook');
require('./workflows/details/edit-passbook');
require('./workflows/details/restore-passbook');
