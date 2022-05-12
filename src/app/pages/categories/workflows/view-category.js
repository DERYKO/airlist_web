import displayCategoryTemplate from '../views/categories-display.tpl.html';

/**
 * @ngdoc service
 * @name factory:viewCategory
 *
 * @description
 *
 */
angular
    .module('airlst.categories')
    .factory('viewCategory', [
        'Alert',
        '$uibModal',
        viewCategory
    ]);

function viewCategory(Alert, $uibModal) {
    return {
        key: 'view-category',
        title: 'Details',
        level: 'row',
        action(payload, store) {

            var modalInstance = $uibModal.open({
                templateUrl: displayCategoryTemplate,
                controller: 'CategoriesDetailsCtrl',
                resolve: {
                    category: function () {
                        return payload.row
                    },
                },
                controllerAs: 'vm'
            });

            modalInstance.result.then(() => store.dispatch('getData'), (response) => {
                if (response.data.message) {
                    Alert.error(response.data.message)
                }
            });
        }

    }
}