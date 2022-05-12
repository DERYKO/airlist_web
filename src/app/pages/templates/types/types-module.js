/**
 * @ngdoc object
 * @name templates
 * @description
 *
 */
angular
    .module('airlst.templates.types', [
        'ui.router',
        'airlst.components'
    ]);

require('./types-routes');

// Controllers
require('./controllers/lists-controller');
require('./controllers/create-controller');
require('./controllers/edit-controller');

// Factories
require('./factories/template_type-factory');