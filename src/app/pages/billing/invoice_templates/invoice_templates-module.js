/**
 * @ngdoc object
 * @name billing.invoice_templates
 * @description
 *
 */
angular
    .module('airlst.billing.invoice_templates', [
        'ui.router',
        //'ngListView'
    ]);

require('./invoice_templates-routes');

// Controllers
require('./controllers/create-controller');
require('./controllers/edit-controller');
require('./controllers/list-controller');

// Factories
require('./factories/invoice_template-factory');
