/**
 * @ngdoc object
 * @name billing.subscriptions
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions', [
        'ui.router',
        //'ngListView'
    ]);

require('./subscriptions-routes');

// Components
// require('./components/contact-subscriptions/component');

// Controllers
require('./controllers/create-controller');
require('./controllers/edit-controller');
require('./controllers/list-controller');
require('./controllers/details-modal');
require('./controllers/terminate-modal');
require('./controllers/create-modal');
require('./controllers/pausing-modal');

// Factories
require('./factories/subscriptions-factory');