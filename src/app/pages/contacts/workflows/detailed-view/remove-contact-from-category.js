/**
 * @ngdoc service
 * @name checkins.factory:removeContactToCategory
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('removeContactFromCategory', [
        'removeCategory',
        'Contacts',
        removeContactFromCategory
    ]);

function removeContactFromCategory(removeCategory, Contacts) {
    return {
        key: 'remove-contact-from-category',
        title: 'Remove Categories',
        level: 'highlight',
        icon: 'user-times',
        order: 70,
        action(contact) {
            const store = Contacts.reset({persist: false});
            store.commit('selectRow', contact.id);
            return removeCategory.action({}, store);
        }
    }
}
