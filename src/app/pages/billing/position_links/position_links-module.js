/**
 * @ngdoc object
 * @name billing.position_links
 * @description
 *
 */
angular
    .module('airlst.billing.position_links', [
        //'ngListView'
    ]);

// Directives
require('./directives/billable_link/billable_link-directive');
require('./directives/position_links/position_links-directive');

// Factories
require('./factories/position_link-factory');