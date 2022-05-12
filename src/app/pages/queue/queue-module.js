/**
 * @ngdoc object
 * @name queue
 * @description
 *
 */
angular
    .module('airlst.queue', [
        'ui.router',
        'airlst.components'
    ]);

require('./queue-routes');

// Controllers
require('./controllers/list-controller');

// Factories
require('./factories/job-log-factory');

// Stores
require('./store/jobs-log');
