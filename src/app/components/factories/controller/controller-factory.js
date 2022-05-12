

/**
 * @ngdoc service
 * @name components.factory:Controller
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .factory('Controller', [
        'Error',
        'locale',
        'ResourceCommon',
        'BootstrapAdapter',
        'StateManager',
        'SweetAlert',
        '$timeout',
        Controller
    ]);

function Controller(Error, locale, ResourceCommon, BootstrapAdapter, StateManager, SweetAlert, $timeout) {
    var trait = {};
    trait.decorate = decorate;
    return trait;

    function decorate(vm) {
        if (_.isUndefined(vm.manager)) {
            vm.manager = StateManager.getManager(vm.name);
        }

        vm.show = show;
        vm.cancelEditing = cancelEditing;
        if (!vm.add) {
            vm.add = addNew;
        }
        vm.create = create;
        if (!vm.show) {
            vm.show = show;
        }
        vm.archiveMany = archiveMany;
        vm.restoreMany = restoreMany;
        vm.deleteMany = deleteMany;
        vm.restore = restore;
        vm.delete = forceDelete;
        vm.archive = archive;
        vm.refresh = refresh;


        return locale.ready(['common', 'sweetalerts']).then(function () {
            vm.manager
                .setModel(vm.model)
                .setPrefix(vm.prefix)
                .loadWorkflows(vm.module ? vm.module : vm.route)
                .addAction('details', {
                    text: 'Details',
                    level: 'row',
                    class: 'btn btn-primary',
                    onClick: vm.show
                })
                .addAction('create', {
                    text: 'Add new',
                    level: 'highlight',
                    onClick: vm.add
                })
                .addAction('table_options', {
                    text: 'Table Options',
                    level: 'settings',
                    icon: 'pe-7s-settings',
                    class: 'color-blue',
                    manager: 'tableOptions'
                })
                .addAction('show_archived', {
                    text: 'Show deleted',
                    level: 'settings',
                    icon: '',
                    class: '',
                    manager: 'showArchived'
                })
                .addAction('archive_selected', {
                    text: locale.getString('common.archive_selected'),
                    level: 'selected',
                    onClick: vm.archiveMany
                })
                .addAction('restore_selected', {
                    text: locale.getString('common.restore_selected'),
                    level: 'archivedSelected',
                    onClick: vm.restoreMany
                })
                .addAction('delete_selected', {
                    text: locale.getString('common.delete_selected'),
                    level: 'archivedSelected',
                    onClick: vm.deleteMany
                })
                .addAction('clear_selected', {
                    text: 'Clear Selection',
                    level: 'selected',
                    manager: 'clearSelection'
                })
                .addAction('load_presets', {
                    text: 'Load Presets',
                    level: 'settings',
                    manager: 'loadPreset'
                })
                .addAction('save_presets', {
                    text: 'Save Presets',
                    level: 'settings',
                    manager: 'savePreset'
                })
                .setAdapter(BootstrapAdapter.getAdapter());

            vm.manager.vm = vm;
            return vm;
        });

        function show(row) {
            vm.selectedRow = row;
            vm.isShowingDetailView = true;
        }

        function cancelEditing() {
            vm.isAddingNew = false;
            vm.isShowingDetailView = false;
            vm.isUpdatingMany = false;
            vm.selectedRow = {};
            vm.selectedRows = [];
        }

        function refresh() {
            vm.manager.refreshData().then(function (data) {
                vm.manager.buildView();
                return data;
            });
        }

        function create(fields) {
            if (!_.isUndefined(fields.birth_day) && fields.birth_day !== null) {
                var date = new Date(fields.birth_day);
                fields.bd_day = date.getDay();
                fields.bd_month = date.getMonth();
                fields.bd_year = date.getFullYear();
            }

            vm.model.post(fields).then(function (model) {
                refresh();
                SweetAlert.swal(locale.getString('sweetalerts.record_saved'), locale.getString('sweetalerts.record_saved_message'), 'success');
                vm.isAddingNew = false;
            }, function (response) {
                Error.checkError(response);
            });
        }

        function addNew() {
            if (!_.isUndefined(vm.methods) && !_.isUndefined(vm.methods.add)) {
                return vm.methods.add().then(function () {
                    return refresh();
                });
            }
            vm.isAddingNew = true;
            vm.isShowingDetailView = false;
            vm.isUpdatingMany = false;
            vm.form = vm.model.form;
        }

        function archiveMany(keys, manager) {
            var model = vm.model.one();
            console.log(vm.model.keys);
            model.keys = keys;

            return SweetAlert.swal({
                    title: locale.getString('sweetalerts.are_you_sure'),
                    text: locale.getString('sweetalerts.archiving_records_confirmation_message'),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ed5565',
                    confirmButtonText: locale.getString('sweetalerts.yes_archive_selected'),
                    showLoaderOnConfirm: true,
                    closeOnConfirm: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        model.customDELETE().then(function () {
                            vm.refresh();
                            SweetAlert.swal(locale.getString('sweetalerts.archive_successful'), locale.getString('sweetalerts.records_archived_message'), 'success');
                        }, function (response) {
                            SweetAlert.swal(locale.getString('sweetalerts.saving_unsuccessful'), response.data.message, 'error');
                        });
                    }
                });
        }

        function restoreMany(keys, manager) {
            return SweetAlert.swal({
                    title: locale.getString('sweetalerts.are_you_sure'),
                    text: locale.getString('sweetalerts.restoring_records_confirmation_message'),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ed5565',
                    confirmButtonText: locale.getString('sweetalerts.yes_restore_selected'),
                    showLoaderOnConfirm: true,
                    closeOnConfirm: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        vm.model.restoreMany(keys).then(function () {
                            vm.refresh();
                            SweetAlert.swal(locale.getString('sweetalerts.restore_successful'), locale.getString('sweetalerts.records_restored_message'), 'success');
                        }, function (response) {
                            SweetAlert.swal(locale.getString('sweetalerts.restore_unsuccessful'), response.data.message, 'error');
                        });
                    }
                });
        }

        function deleteMany(keys, manager) {
            return SweetAlert.swal({
                    title: locale.getString('sweetalerts.are_you_sure'),
                    text: locale.getString('sweetalerts.deleting_records_confirmation_message'),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ed5565',
                    confirmButtonText: locale.getString('sweetalerts.yes_delete_selected'),
                    showLoaderOnConfirm: true,
                    closeOnConfirm: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        vm.model.deleteMany(keys).then(function () {
                            vm.refresh();
                            SweetAlert.swal(locale.getString('sweetalerts.delete_successful'), locale.getString('sweetalerts.records_deleted_message'), 'success');
                        }, function (response) {
                            SweetAlert.swal(locale.getString('sweetalerts.delete_unsuccessful'), response.data.message, 'error');
                        });
                    }
                });
        }

        function archive() {
            vm.selectedRow = {};
            vm.isShowingDetailView = false;
            vm.refresh();
        }

        function restore() {
            vm.selectedRow = {};
            vm.isShowingDetailView = false;
            refresh();
        }

        function forceDelete() {
            vm.selectedRow = {};
            vm.isShowingDetailView = false;
            refresh();
        }

    }
}
