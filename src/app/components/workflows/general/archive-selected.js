/**
 * @ngdoc service
 * @name checkins.factory:archiveSelected
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('archiveSelected', [
        archiveSelected
    ]);

function archiveSelected() {
    return {
        key: 'archive-selected',
        title: 'Delete selected',
        level: 'selected',
        manager: 'archiveMany'
    }
}
