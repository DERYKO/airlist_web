/**
 * @ngdoc object
 * @name main
 * @description
 *
 */
angular
    .module('airlst.documents.templates', [
        'ui.router',
        'airlst.components',
        //'ngListView'
    ]);

require('./templates-routes');

// Controllers
require('./controllers/create-controller');
require('./controllers/details-controller');
require('./controllers/edit-controller');
require('./controllers/list-controller');

// Factories
require('./factories/template-factory');

// Store
require('./store/template');