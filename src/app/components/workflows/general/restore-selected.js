angular
    .module('airlst.components')
    .factory('restoreSelected', restoreSelected);

function restoreSelected() {
    return {
        key: 'restore-selected',
        title: 'Restore selected',
        level: 'archivedSelected',
        manager: 'restoreMany'
    }
}