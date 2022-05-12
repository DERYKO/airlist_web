/**
 * @ngdoc service
 * @name checkins.factory:addContactToPicklists
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('addContactToPicklists', [
        'addContactsToPicklists',
        'Contacts',
        addContactToPicklists
    ]);

function addContactToPicklists(addContactsToPicklists, Contacts) {
    return {
        key: 'add-contact-to-picklists',
        title: 'Add To Picklist',
        level: 'highlight',
        icon: 'users',
        order: 80,
        action(contact) {
            const store = Contacts.reset({persist: false});
            store.commit('selectRow', contact.id);
            return addContactsToPicklists.action({}, store);
        }
    }
}
