/**
 * @ngdoc components
 * @name factory:showDeleted
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('showDeleted', [
        showDeleted
    ]);

function showDeleted() {
    return {
        key: 'show-deleted',
        title: 'Show Deleted',
        level: 'settings',
        manager: 'showArchived'
    }
}