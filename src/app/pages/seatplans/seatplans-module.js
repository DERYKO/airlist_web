/**
 * @ngdoc object
 * @name users
 * @description
 *
 */
angular
    .module('airlst.seatplans', [
        'ui.router',
        'airlst.components'
    ]);

require('./seatplans-routes');

// Controllers
require('./controllers/seatplans-create-controller');
require('./controllers/seatplans-demo-controller');
require('./controllers/seatplans-details-controller');
require('./controllers/seatplans-edit-controller');
require('./controllers/seatplans-elements-controller');
require('./controllers/seatplans-lists-controller');

// Directives
require('./directives/seatplan-example-directive');
require('./directives/seatplan-group-directive');


// Factories
require('./factories/seatplan-element-factory');
require('./factories/seatplan-factory');
require('./factories/seatplan-group-factory');

// Stores
require('./store/seatplan_elements');

// Scripts
require('./scripts/drawing.seatplans.airlst');