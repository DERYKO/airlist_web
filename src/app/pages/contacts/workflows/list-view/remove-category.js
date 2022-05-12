/**
 * @ngdoc service
 * @name checkins.factory:removeCategory
 *
 * @description
 *
 */
angular
    .module('airlst.contacts')
    .factory('removeCategory', [
        'Alert',
        'Categories',
        'Env',
        '$http',
        'locale',
        'SelectBox',
        removeCategory
    ]);

function removeCategory(Alert, Categories, Env, $http, locale, SelectBox) {
    return {
        key: 'remove-category',
        title: 'Remove Categories',
        level: 'selected',
        action({}, store) {
            return locale.ready(['categories', 'sweetalerts'])
                .then(() => {
                    SelectBox.multiple(Categories)
                        .then(response => {
                            $http.delete(Env.apiUrl + '/categories/contacts', {
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
                                    contacts: store.getters.selectedFilters
                                }
                            }).then(() => {
                                store.dispatch('getData');
                                Alert.success(locale.getString('sweetalerts.remove_successful'), locale.getString('categories.contacts_removed'));
                            }, err => Alert.handle(err))
                        }, err => Alert.handle(err));
                });
        }
    }
}