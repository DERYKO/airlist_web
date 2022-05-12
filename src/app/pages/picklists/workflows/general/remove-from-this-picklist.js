/**
 * @ngdoc service
 * @name checkins.factory:removeFromThisPicklist
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('removeFromThisPicklist', [

        'locale',
        '$http',
        'Alert',
        removeFromThisPicklist
    ]);

function removeFromThisPicklist(locale, $http, Alert) {
    return {
        key: 'remove-from-this-picklist',
        title: 'Remove from this picklist',
        level: 'selected',
        action({}, store) {
            return locale.ready(['picklists', 'sweetalerts'])
                .then(() => {
                    $http.delete('picklists/contacts', {
                        data: {
                            picklists: {
                                count: 1,
                                filters: [
                                    {
                                        field: 'id',
                                        operator: 'IN',
                                        value: [store.state.vm.picklist.id]
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
        }
    }
}