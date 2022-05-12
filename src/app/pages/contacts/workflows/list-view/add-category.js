/**
 * @ngdoc service
 * @name checkins.factory:addCategory
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('addCategory', [
        'Alert',
        'Categories',
        '$http',
        'locale',
        'SelectBox',
        addCategory
    ]);

function addCategory(Alert, Categories, $http, locale, SelectBox) {
    return {
        key: 'add-contacts-to-category',
        title: 'Add Categories',
        level: 'selected',
        action({}, store) {
            return locale.ready(['categories', 'sweetalerts'])
                .then(() => {
                    SelectBox.multiple(Categories)
                        .then(response => {
                            $http.post('categories/contacts', {
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
                                contacts: store.getters.selectedFilters
                            }).then(() => {
                                store.dispatch('getData');
                                Alert.success(locale.getString('sweetalerts.add_successful'), locale.getString('categories.contacts_added'));
                            }, err => Alert.handle(err))
                        }, err => Alert.handle(err));
                });
        }
    }
}