/**
 * @ngdoc service
 * @name checkins.factory:addContactToCategory
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('addContactToCategory', [
        'addCategory',
        'Contacts',
        addContactToCategory
    ]);

function addContactToCategory(addCategory, Contacts) {
    return {
        key: 'add-contact-to-category',
        title: 'Add Categories',
        level: 'highlight',
        icon: 'users',
        order: 60,
        action(contact) {
            const store = Contacts.reset({persist: false});
            store.commit('selectRow', contact.id);
            return addCategory.action({}, store);
        }
    }
}
