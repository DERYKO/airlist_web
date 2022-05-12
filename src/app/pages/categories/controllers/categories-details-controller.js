import '../store/categories';

/**
 * @ngdoc object
 * @name categories.controller:CategoriesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.categories')
    .controller('CategoriesDetailsCtrl', [
        'Alert',
        'Category',
        'category',
        'locale',
        '$uibModalInstance',
        CategoriesDetailsCtrl
    ]);

function CategoriesDetailsCtrl(Alert, Category, category, locale, $uibModalInstance) {
    var vm = this;

    vm.save = save;
    vm.trash = trash;
    vm.close = close;
    vm.category = category;

    function save() {
        const category = Category.one(vm.category.id);
        category.name = vm.category.name;

        return $uibModalInstance.close(category.put());
    }

    function trash() {
        const promise = Alert.confirm({
            title: 'Deleting Category: ' + vm.category.name,
            text: locale.getString('sweetalerts.confirm_archive'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ed5565',
            confirmButtonText: locale.getString('sweetalerts.yes_archive'),
            showLoaderOnConfirm: true,
            closeOnConfirm: true
        })
            .then(() => Category.one(category.id).remove());

        $uibModalInstance.close(promise);
    }

    function close() {
        $uibModalInstance.dismiss('close');
    }
}