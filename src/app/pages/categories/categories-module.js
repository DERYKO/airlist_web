/* @ngdoc object
 * @name categories
 * @description
 *
 */
angular
    .module('airlst.categories', [
        'ui.router',
        'airlst.components'
    ]);

require('./categories-routes');

// Controllers
require('./controllers/categories-controller');
require('./controllers/categories-list-controller');

// Directives
require('./directives/category/category-directive');

// Factories
require('./factories/category-factory');

require('./workflows/create-category');
require('./workflows/view-category');