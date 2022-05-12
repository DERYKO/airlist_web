/**
 * @ngdoc object
 * @name toolbox
 * @description
 *
 */
angular
    .module('airlst.toolbox', [
        'ui.router',
        'airlst.components'
    ]);

require('./toolbox-routes');

// Controllers
require('./controllers/toolbox-controller');

// Filters
require('./filters/holder-to-value-filter');
require('./filters/humanize-filter');
require('./filters/operator-to-string-filter');