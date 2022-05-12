/**
 * @ngdoc service
 * @name checkins.factory:removeRsvpsFromCategories
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('removeRsvpsFromCategories', [
        'SweetAlert',
        'locale',
        'Categories',
        'SelectBox',
        'Alert',
        '$http',
        removeRsvpsFromCategories
    ]);


function removeRsvpsFromCategories(SweetAlert, locale, Categories, SelectBox, Alert, $http) {
    return {
        key: 'remove-rsvps-to-categories',
        title: 'Remove from Category(s)',
        level: 'selected',
        action: removeFromCategories
    };

    function removeFromCategories(action, store) {
        return locale.ready(['rsvps', 'sweetalerts'])
            .then(() => {
                SelectBox.multiple(Categories, {
                    displayField: 'name'
                }).then(response => {
                    $http.delete('categories/rsvps', {
                        data: {
                            categories: {
                                count: response.data.length,
                                filters: [
                                    {
                                        field: 'id',
                                        operator: 'IN',
                                        value: response.data
                                    }
                                ]
                            },
                            rsvps: store.getters.selectedFilters
                        }
                    }).then(() => {
                        store.dispatch('getData');
                        Alert.success(locale.getString('sweetalerts.remove_successful'), locale.getString('rsvps.rsvps_contacts_removed_from_categories'));
                    }, err => Alert.handle(err))
                }, err => Alert.handle(err));
            });
    }
}
