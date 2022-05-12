/**
 * @ngdoc object
 * @name billing.position_categories
 * @description
 *
 */
angular
    .module('airlst.billing.position_categories', [
        'ui.router',
        //'ngListView'
    ]);

require('./position_categories-routes');

// Controllers
require('./controllers/create-controller');
require('./controllers/edit-controller');
require('./controllers/list-controller');

// Factories
require('./factories/position_category-factory');