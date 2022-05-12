/**
 * @ngdoc service
 * @name checkins.factory:showPicklistContacts
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('showPicklistContacts', [
        '$state',
        showPicklistContacts
    ]);

function showPicklistContacts($state) {
    return {
        key: 'show-picklist-contacts',
        title: 'Contacts',
        level: 'row',
        action: function ({row}, store) {
            $state.go('app.picklists.contacts.index', {pid: row.id});
        }
    }
}
