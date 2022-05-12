/**
 * @ngdoc object
 * @name billing.stripe
 * @description
 *
 */
angular
    .module('airlst.billing.stripe', [
        'ui.router',
        //'ngListView'
    ]);

require('./stripe-routes');

// Controllers
require('./controllers/connection-info-controller');
// require('./controllers/edit-controller');
// require('./controllers/list-controller');

// Factories
// require('./factories/position-factory');