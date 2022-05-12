/**
 * @ngdoc service
 * @name checkins.factory:removeFromPicklist
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('removeFromPicklist', [
        'Alert',
        'Picklists',
        '$http',
        'locale',
        'SelectBox',
        removeFromPicklist
    ]);

function removeFromPicklist(Alert, Picklists, $http, locale, SelectBox) {
    return {
        key: 'remove-from-picklist',
        title: 'Remove From Picklist(s)',
        level: 'selected',
        action({}, store) {
            return locale.ready(['picklists', 'sweetalerts'])
                .then(() => {
                    SelectBox.multiple(Picklists,{
                        displayField: 'name_with_count'
                    }).then(response => {
                            $http.delete('picklists/contacts', {
                                data: {
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
                                }
                            }).then(() => {
                                store.dispatch('getData');
                                Alert.success(locale.getString('sweetalerts.remove_successful'), locale.getString('picklists.contacts_successfully_removed'));
                            }, err => Alert.handle(err))
                        }, err => Alert.handle(err));
                });
        }
    }
}