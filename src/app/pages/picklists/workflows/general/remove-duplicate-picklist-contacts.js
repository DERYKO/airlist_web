/**
 * @ngdoc service
 * @name checkins.factory:removeDuplicatePicklistContacts
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('removeDuplicatePicklistContacts', [
        'Alert',
        '$http',
        'locale',
        removeDuplicatePicklistContacts
    ]);

function removeDuplicatePicklistContacts(Alert, $http, locale) {
    return {
        key: 'remove-duplicate-picklist-contacts',
        title: 'Remove duplicate contacts',
        level: 'selected',
        action: function ({}, store) {
            return $http.delete(`picklists/${ store.vm.picklist.id }/duplicates`, {
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
                Alert.success(locale.getString('picklists.duplicate_contacts_successfully_removed'));
            }, err => Alert.handle(err))
        }
    }
}