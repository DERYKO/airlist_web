import templateUrl from './category-directive.tpl.html';

/**
 * @ngdoc directive
 * @name categories.directive:category
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
 <example module='categories'>
 <file name='index.html'>
 <category model=''></category>
 </file>
 </example>
 *
 */
angular
    .module('airlst.categories')
    .directive('category', [category]);

function category() {
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: templateUrl,
        replace: false,
        controllerAs: 'category',
        controller: [
            'Contact',
            'Category',
            'Error',
            'locale',
            'SelectBox',
            'SweetAlert',
            '$state',
            '$q',
            CategoryCtrl
        ],
        bindToController: {
            model: '=',
            manager: '=',
            showContact: '=',
            onHide: '&',
            onArchive: '&'
        }
    };
}

function CategoryCtrl(Contact, Category, Error, locale, SelectBox, SweetAlert, $state, $q) {
    var vm = this;
    vm.name = locale.getString('categories.title_details');
    vm.editing = false;

    vm.save = save;
    vm.restore = restore;
    vm.delete = forceDelete;
    vm.hide = hide;
    vm.archive = archive;
    vm.cancelEditing = cancelEditing;

    init();

    function setupEditor() {
        Category.getSchema().then(function (schema) {
            vm.schema = schema;
        });
        vm.form = Category.getForm();
    }

    function refreshContacts() {
        $q.when(vm.model).then(function (model) {
            model.getList('contacts', {include: 'categories'})
                .then(function (response) {
                    vm.contacts.collection = response;
                });
        });
    }

    function setupContacts() {
        vm.contacts = {
            parent: vm.model,
            settings: {
                filterable: 'internal',
                pagination: 'internal',
                sorting: 'internal',
                dropdowns: {
                    add: !(vm.model && vm.model.archived),
                    columns: true,
                    archived: false,
                    import: false,
                    duplicates: false
                }
            },
            methods: {
                add: function () {
                    return SelectBox.multiple(Contact,
                        {
                            listview: {
                                filterable: 'external',
                                pagination: 'external'
                            }
                        }
                    ).then(function (response) {
                        return vm.model.addContacts(response.keys).then(function () {
                            refreshContacts();
                            SweetAlert.swal(locale.getString('sweetalerts.contact_added_title'), locale.getString('sweetalerts.contact_added_message'), 'success');
                        });
                    });
                }
            }
        };
        //refreshContacts();
    }

    function init() {
        setupEditor();
        setupContacts()
    }

    function save(model) {
        model.save().then(function () {
            vm.model = model;
            vm.editing = false;
        }, function (response) {
            Error.checkError(response);
        });
    }

    function cancelEditing() {
        vm.editing = false;
    }

    function hide() {
        var data = {};
        if (vm.manager) {
            data = {
                notify: false,
                reload: false,
                location: true
            };
        }
        $state.go('app.categories.index', {}, data);
        vm.onHide();
    }

    function restore(model) {
        SweetAlert.swal({
                title: locale.getString('common.confirm_restore'),
                text: locale.getString('categories.confirm_restore'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_restore'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.restore().then(function (model) {
                        SweetAlert.swal(locale.getString('common.restore_successful'), locale.getString('categories.restore_successful'), 'success');
                        vm.model = model;
                    }, function (response) {
                        SweetAlert.swal(locale.getString('common.restore_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function forceDelete(model) {
        SweetAlert.swal({
                title: locale.getString('common.confirm_force_delete'),
                text: locale.getString('categories.confirm_force_delete'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('common.yes_force_delete'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.forceDelete().then(function () {
                        $state.go('app.categories.index');
                        SweetAlert.swal(locale.getString('common.force_delete_successful'), locale.getString('categories.force_delete_successful'), 'success');
                    }, function (response) {
                        SweetAlert.swal(locale.getString('common.force_delete_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function archive() {
        SweetAlert.swal({
                title: locale.getString('common.confirm_archive'),
                text: locale.getString('categories.confirm_archive'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_archive'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    vm.model.doDELETE().then(function (model) {
                        SweetAlert.swal(locale.getString('sweetalerts.archive_successful'), locale.getString('categories.archive_successful'), 'success');
                        vm.model = model;
                        setupContacts();
                        vm.onArchive({category: vm.model});
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.archive_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

}