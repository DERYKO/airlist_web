/**
 * @ngdoc service
 * @name checkins.factory:addContactsToPicklist
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('addContactsToPicklist', [
        'Alert',
        'Contacts',
        '$http',
        'locale',
        'SelectBox',
        addContactsToPicklist
    ]);

function addContactsToPicklist(Alert, Contacts, $http, locale, SelectBox) {
    return {
        key: 'add-contacts-to-picklist',
        title: 'Add new contacts',
        level: 'highlight',
        icon: 'user-plus',
        order: 5,
        action({}, store) {
            SelectBox.multiple(Contacts.reset({persist: false}), {
                displayField: 'full_name'
            }).then(response => {
                console.log(response);
                $http.post('picklists/contacts', {
                    picklists: {
                        count: 1,
                        filters: [{
                            field: 'id',
                            operator: 'IN',
                            value: [store.state.vm.picklist.id]
                        }]
                    },
                    contacts: response.store.getters.selectedFilters,
                }).then(() => {
                    Alert.success(locale.getString('sweetalerts.add_successful'), locale.getString('picklists.contacts_added'));
                    store.dispatch('getData');
                }, err => Alert.handle(err))
            }, err => Alert.handle(err));
        }
    }
}
