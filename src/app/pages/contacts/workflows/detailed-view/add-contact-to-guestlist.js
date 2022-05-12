/**
 * @ngdoc service
 * @name checkins.factory:addContactToGuestlist
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('addContactToGuestlist', [
        'addToGuestlist',
        'Contacts',
        '$stateParams',
        addContactToGuestlist
    ]);

function addContactToGuestlist(addToGuestlist, Contacts, $stateParams) {
    return {
        key: 'add-contact-to-guestlist',
        title: 'Add To Guestlist',
        level: 'highlight',
        icon: 'plus',
        order: 50,
        action(contact) {
            const store = Contacts.reset({persist: false});
            store.commit('setData', [contact]);
            store.commit('selectRow', contact.id);
            const backParams = {
                id: $stateParams.id,
                contact: contact,
                skipReload: true,
                tab: 'rsvps',
                store: $stateParams.store,
                back: $stateParams.back,
                backParams: $stateParams.backParams,
            }
            return addToGuestlist.action({back: 'app.contacts.details.tab', backParams}, store);
        }
    }
}
