/**
 * @ngdoc object
 * @name billing.positions
 * @description
 *
 */
angular
    .module('airlst.billing.positions', [
        'ui.router',
        //'ngListView'
    ]);

require('./positions-routes');

// Controllers
require('./controllers/create-controller');
require('./controllers/edit-controller');
require('./controllers/list-controller');

// Factories
require('./factories/position-factory');