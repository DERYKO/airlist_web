/**
 * @ngdoc object
 * @name billing.invoices
 * @description
 *
 */
angular
    .module('airlst.billing.invoices', [
        'ui.router',
        //'ngListView'
    ]);

require('./invoices-routes');

// Controllers
require('./controllers/create-modal-controller');
require('./controllers/details-controller');
require('./controllers/edit-modal-controller');
require('./controllers/list-controller');
require('./controllers/update-address-modal-controller');
require('./controllers/cancel-invoice-modal-controller');
require('./controllers/payments/create-modal-controller');
require('./controllers/payments/edit-modal-controller');

// Directives
// require('./directives/invoices/invoices-directive');
require('./directives/invoice-payments/invoice-payments-directive');

// Stores
require('./store/invoices');
require('./store/payments');

// Factories
require('./factories/invoice-factory');
require('./factories/payment-factory');

//Workflows
require('./workflows/download-invoices');