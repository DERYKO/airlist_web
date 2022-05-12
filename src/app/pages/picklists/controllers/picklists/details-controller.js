

/**
 * @ngdoc object
 * @name picklists.controller:PicklistsDetailsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .controller('PicklistsDetailsCtrl', [
        'Error',
        'locale',
        'Picklist',
        '$state',
        '$stateParams',
        'SweetAlert',
        PicklistsDetailsCtrl
    ]);

function PicklistsDetailsCtrl(Error, locale, Picklist, $state, $stateParams, SweetAlert) {

    var vm = this;
    vm.defaults = {};
    vm.customs = _.range(1, 21);
    vm.name = locale.getString('picklists.title_details');

    vm.save = save;
    vm.edit = edit;
    vm.hide = hide;
    vm.archive = archive;
    vm.restore = restore;
    vm.delete = forceDelete;
    vm.cancelEditing = cancelEditing;

    init();

    function init() {
        if ($stateParams.store) {
            vm.manger = $stateParams.store;
        }

        loadPicklist();
    }

    function loadPicklist() {
        if ($stateParams.picklist) {
            vm.picklist = $stateParams.picklist
        } else {
            Picklist.one($stateParams.pid).get().then(function (record) {
                vm.picklist = record;
            }, function () {
                SweetAlert.swal(locale.getString('picklists.picklist_not_found'), locale.getString('picklists.picklist_not_found_message'), 'error');
            });
        }
    }

    function edit() {
        $state.go('app.picklists.contacts.edit-settings', {pid: vm.picklist.id, picklist: vm.picklist});
    }

    function save(model) {
        model.save().then(function () {
            vm.model = model;
            if (!_.isUndefined(vm.row)) {
                vm.row.entity = model;
                if (!_.isUndefined(vm.onUpdate)) {
                    vm.onUpdate();
                }
            }
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
        $state.go('app.picklists.contacts.index', {}, data);
    }

    function restore(model) {
        SweetAlert.swal({
                title: locale.getString('sweetalerts.confirm_restore'),
                text: locale.getString('picklists.confirm_restore'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_restore'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.restore().then(function (model) {
                        SweetAlert.swal(locale.getString('sweetalerts.restore_successful'), locale.getString('picklists.restore_successful'), 'success');
                        vm.model = model;
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.restore_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function forceDelete(model) {
        SweetAlert.swal({
                title: locale.getString('sweetalerts.confirm_force_delete'),
                text: locale.getString('picklists.confirm_force_delete'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: locale.getString('sweetalerts.yes_force_delete'),
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    model.forceDelete().then(function () {
                        $state.go('app.picklists.index');
                        SweetAlert.swal(locale.getString('sweetalerts.force_delete_successful'), locale.getString('picklists.force_delete_successful'), 'success');
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.force_delete_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }

    function archive() {
        SweetAlert.swal({
                title: locale.getString('sweetalerts.confirm_archive'),
                text: locale.getString('picklists.confirm_archive'),
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
                        SweetAlert.swal(locale.getString('sweetalerts.archive_successful'), locale.getString('picklists.archive_successful'), 'success');
                        vm.model = model;
                        vm.onArchive();
                    }, function (response) {
                        SweetAlert.swal(locale.getString('sweetalerts.archive_not_successful'), response.data.message, 'error');
                    });
                }
            });
    }
}