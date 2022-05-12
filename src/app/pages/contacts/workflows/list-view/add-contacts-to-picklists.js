/**
 * @ngdoc service
 * @name checkins.factory:addContactsToPicklists
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('addContactsToPicklists', [
        'Alert',
        'Picklists',
        '$http',
        'locale',
        'SelectBox',
        addContactsToPicklists
    ]);

function addContactsToPicklists(Alert, Picklists, $http, locale, SelectBox) {
    return {
        key: 'add-contacts-to-picklists',
        title: 'Add To Picklist(s)',
        level: 'selected',
        action({}, store) {
            return locale.ready(['picklists', 'sweetalerts'])
                .then(() => {
                    SelectBox.multiple(Picklists.reset({
                        persists: false,
                        listview: 'PicklistSelectboxStore'
                    }), {
                        displayField: 'name_with_count'
                    }).then(response => {
                        $http.post('picklists/contacts', {
                            picklists: {
                                count: response.data.length,
                                filters: [
                                    {
                                        field: 'id',
                                        operator: 'IN',
                                        value: response.data
                                    }
                                ]
                            },
                            contacts: store.getters.selectedFilters
                        }).then(() => {
                            store.dispatch('getData');
                            Alert.success(locale.getString('sweetalerts.add_successful'), locale.getString('picklists.contacts_added'));
                        }, err => Alert.handle(err))
                    }, err => Alert.handle(err));
                });
        }
    }
}
