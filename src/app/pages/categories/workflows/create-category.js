import createCategoryTemplate from '../views/categories-create.tpl.html';

/**
 * @ngdoc service
 * @name factory:createCategory
 *
 * @description
 *
 */
angular
    .module('airlst.categories')
    .factory('createCategory', [
        'Alert',
        'locale',
        '$uibModal',
        createCategory
    ]);

function createCategory(Alert, locale, $uibModal) {
    return {
        key: 'create-category',
        title: 'Add new',
        level: 'highlight',
        class: 'btn-success',
        icon: 'plus-circle',
        action(payload, store) {
            var modalInstance = $uibModal.open({
                templateUrl: createCategoryTemplate,
                controller: ['$uibModalInstance', 'Category', function ($uibModalInstance, Category) {
                    var vm = this;

                    vm.model = {};
                    vm.save = save;
                    vm.close = close;

                    function save(category) {
                        $uibModalInstance.close(Category.post(category));
                    }

                    function close() {
                        $uibModalInstance.dismiss('close');
                    }
                }],
                controllerAs: 'vm'
            });

            modalInstance.result.then((category) => {
                store.dispatch('getData');
                Alert.success(locale.getString('sweetalerts.add_successful'), locale.getString('common.save_successful'));
            }, (response) => {
                if (response.data.message) {
                    Alert.error(response.data.message)
                }
            });

        }
    }
}