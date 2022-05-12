/**
 * @ngdoc object
 * @name templates
 * @description
 *
 */
angular
    .module('airlst.statistics', [
        'ui.router',
        'airlst.components'
    ]);

require('./directives/stats/stats-directive');