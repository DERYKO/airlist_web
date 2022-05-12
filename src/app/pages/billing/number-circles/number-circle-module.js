/* @ngdoc object
 * @name billing.number-circles
 * @description
 *
 */
angular
    .module('airlst.billing.number-circles', [
        'ui.router',
        //'ngListView'
    ]);

require('./number-circle-routes');

// Controllers
require('./controllers/create-controller');
require('./controllers/edit-controller');
require('./controllers/list-controller');

// Factories
require('./factories/number-circle-factory');
