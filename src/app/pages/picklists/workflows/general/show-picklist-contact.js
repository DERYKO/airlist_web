/**
 * @ngdoc service
 * @name checkins.factory:showPicklistContact
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('showPicklistContact', [
        '$state',
        showPicklistContact
    ]);

function showPicklistContact($state) {
    return {
        key: 'show-picklist-contact',
        title: 'Contacts',
        level: 'row',
        class: 'btn btn-default btn-sm',
        action: function ({row}, store) {
            $state.go('app.picklists.contacts.details', {
                pid: store.state.vm.picklist.id,
                picklist: store.state.vm.picklist,
                cid: row.id,
                contact: row,
                store: store
            })
        }
    }
}