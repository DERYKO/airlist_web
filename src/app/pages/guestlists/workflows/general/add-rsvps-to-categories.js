/**
 * @ngdoc service
 * @name checkins.factory:addRsvpsToCategories
 * @description
 *
 */

angular
    .module('airlst.guestlists')
    .factory('addRsvpsToCategories', [
        'SweetAlert',
        'locale',
        'Categories',
        'SelectBox',
        'Alert',
        '$http',
        addRsvpsToCategories,
    ]);

function addRsvpsToCategories(SweetAlert, locale, Categories, SelectBox, Alert, $http) {
    return {
        key: 'add-rsvps-to-categories',
        title: 'Add to Category(s)',
        level: 'selected',
        action: addToCategories
    };

    function addToCategories(action, store) {
        return locale.ready(['rsvps', 'sweetalerts'])
            .then(() => {
                SelectBox.multiple(Categories, {
                    displayField: 'name'
                }).then(response => {
                    $http.post('categories/rsvps', {
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
                    }).then(() => {
                        store.dispatch('getData');
                        Alert.success(locale.getString('sweetalerts.add_successful'), locale.getString('rsvps.rsvps_contacts_added_to_categories'));
                    }, err => Alert.handle(err))
                }, err => Alert.handle(err));
            });
    }
}
