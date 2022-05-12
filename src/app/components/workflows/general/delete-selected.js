/**
 * @ngdoc service
 * @name checkins.factory:deleteSelected
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('deleteSelected', [
        deleteSelected
    ]);

function deleteSelected() {
    return {
        key: 'delete-selected',
        title: 'Permanently delete selected',
        level: 'archivedSelected',
        manager: 'deleteMany'
    }
}