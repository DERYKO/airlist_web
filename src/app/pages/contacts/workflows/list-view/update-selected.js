/**
 * @ngdoc service
 * @name checkins.factory:updateSelected
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('updateSelectedContacts', [
        '$state',
        updateSelectedContacts
    ]);

function updateSelectedContacts($state) {
    return {
        key: 'update-selected-contacts',
        title: 'Update Selected',
        level: 'selected',
        action: function (payload, store) {
            $state.go('app.contacts.multiple', {store: store});
        }
    }
}