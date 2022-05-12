/**
 * @ngdoc service
 * @name checkins.factory:removeContactToPicklist
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('removeContactFromPicklist', [
        'removeFromPicklist',
        'Contacts',
        removeContactFromPicklist
    ]);

function removeContactFromPicklist(removeFromPicklist, Contacts) {
    return {
        key: 'remove-contact-from-picklist',
        title: 'Remove Picklists',
        level: 'highlight',
        icon: 'user-times',
        order: 90,
        action(contact) {
            const store = Contacts.reset({persist: false});
            store.commit('selectRow', contact.id);
            return removeFromPicklist.action({}, store);
        }
    }
}
