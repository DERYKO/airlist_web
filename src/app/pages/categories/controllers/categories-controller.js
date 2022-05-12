/**
 * @ngdoc object
 * @name categories.controller:CategoriesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.categories')
    .controller('CategoriesCtrl', [
        'Controller',
        'Category',
        'locale',
        'BootstrapAdapter',
        '$state',
        '$stateParams',
        CategoriesCtrl
    ]);

function CategoriesCtrl(Controller, Category, locale, BootstrapAdapter, $state, $stateParams) {
    var vm = this;

    vm.name = 'CategorieslistView';
    vm.model = Category;
    vm.defaults = {};
    vm.show = showCategory;
    vm.hide = hide;

    init();

    function init() {
        if ($stateParams.id) {
            console.log($stateParams);
            if ($stateParams.category) {
                showCategory($stateParams.category);
            } else if ($stateParams.parent) {
                showCategory($stateParams.parent);
            }
            else {
                Category.one($stateParams.id).get().then(function (category) {
                    showCategory(category);
                });
            }
        }
        else {
            Controller.decorate(vm).then(function (_vm) {
                vm = _vm;
                setupListView();
                setupEditor();
            });
        }
    }

    function setupListView() {
        locale.ready(['common']).then(function () {
            vm.manager
                .setTitle('Categories')
                .setModel(Category)
                .addAction('details', {
                    text: locale.getString('common.view'),
                    class: 'btn btn-xs btn-info btn-simple',
                    icon: 'fa fa-search',
                    level: 'row',
                    onClick: showCategory
                })
                .setAdapter(BootstrapAdapter.getAdapter())
                .buildView().then(function (adapter) {
                vm.adapter = adapter;
            });
        });
    }

    function setupEditor() {
        Category.getSchema().then(function (schema) {
            vm.schema = schema;
        });

        vm.form = Category.getForm();
    }

    function showCategory(category) {
        vm.selectedRow = category;
        vm.isShowingDetailView = true;
        if (!$stateParams.parent || !$stateParams.category) {
            if ($stateParams.contact_id) {
                $state.go('app.categories.contact_details', {
                    id: category.id,
                    parent: category
                }, {
                    notify: false,
                    reload: false,
                    location: true
                });

            } else {
                $state.go('app.categories.details', {
                    id: category.id,
                    category: category
                }, {
                    notify: false,
                    reload: false,
                    location: true
                });
            }
        }
    }

    function hide() {
        vm.selectedRow = undefined;
        vm.isShowingDetailView = false;
    }
}