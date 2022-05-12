/**
 * @ngdoc object
 * @name dashboard
 * @description
 *
 */
angular
    .module('airlst.dashboard', [
        'ui.router',
        'airlst.components',
        'airlst.theme.airlst'
    ]);

require('./dashboard-routes.js');

// Components
require('./components/default/component');
require('./components/heart-finance/component');
require('./components/airport-on-event/component');
require('./components/dekra-dashboard/component');

// Controllers
require('./controllers/dashboard-controller');

// Directives
require('./directives/dashboard-barchart-simple-directive');
require('./directives/dashboard-sex-directive');
require('./directives/dashboard-tabular-simple-directive.tpl.html');
