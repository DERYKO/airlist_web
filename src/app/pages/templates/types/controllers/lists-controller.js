import editorTemplate from '../views/editor.tpl.html';
import '../store/types';

/**
 * @ngdoc object
 * @name templates.controller:TemplatesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.templates.types')
    .controller('TemplateTypesCtrl', [
        'TemplateTypes',
        '$uibModal',
        '$state',
        TemplateTypesCtrl
    ]);

function TemplateTypesCtrl(TemplateTypes, $uibModal, $state) {

    var vm = this;

    init();

    function init() {
        vm.store = TemplateTypes;
        vm.showCreate = showCreate;
        vm.showEdit = showEdit;
        vm.store.commit('setVm', vm);
    }

    function showCreate() {
        $state.go('app.templates.types.create');
    }

    function showEdit(payload) {
        $state.go('app.templates.types.edit', {
            id: payload.row.id
        });
        return;
        var modalInstance = $uibModal.open({
            templateUrl: editorTemplate,
            controller: [
                'store',
                'templateType',
                '$uibModalInstance',
                'SweetAlert',
                function (store, templateType, $uibModalInstance, SweetAlert) {
                    var vm = this;

                    vm.store = store;
                    vm.model = {};
                    vm.save = save;
                    vm.trash = trash;
                    vm.delete = deletePermanently;
                    vm.restore = restore;
                    vm.close = close;
                    vm.model = templateType;

                    function save(templateType) {
                        templateType.save()
                            .then(function () {
                                vm.store.dispatch('getData');
                                $uibModalInstance.close();
                            })
                    }

                    function trash() {
                        SweetAlert.swal({
                                title: locale.getString('sweetalerts.confirm_archive'),
                                text: locale.getString('templates.types.confirm_archive'),
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#ed5565',
                                confirmButtonText: locale.getString('sweetalerts.yes_archive'),
                                showLoaderOnConfirm: true,
                                closeOnConfirm: false
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    templateType.remove()
                                        .then(function (model) {
                                            SweetAlert.swal(locale.getString('sweetalerts.archive_successful'), locale.getString('templates.types.archive_successful'), 'success');
                                            vm.store.dispatch('getData');
                                            $uibModalInstance.close();
                                        }, function (response) {
                                            SweetAlert.swal(locale.getString('sweetalerts.archive_not_successful'), response.data.message, 'error');
                                        })
                                }
                            });
                    }

                    function deletePermanently() {
                        SweetAlert.swal({
                                title: locale.getString('sweetalerts.confirm_force_delete'),
                                text: locale.getString('templates.types.confirm_force_delete'),
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#ed5565',
                                confirmButtonText: locale.getString('sweetalerts.yes_force_delete'),
                                showLoaderOnConfirm: true,
                                closeOnConfirm: false
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    templateType.forceDelete()
                                        .then(function () {
                                            SweetAlert.swal(locale.getString('sweetalerts.force_delete_successful'), locale.getString('templates.types.force_delete_successful'), 'success');
                                            vm.store.dispatch('getData');
                                            $uibModalInstance.close();
                                        }, function (response) {
                                            SweetAlert.swal(locale.getString('sweetalerts.force_delete_not_successful'), response.data.message, 'error');
                                        })
                                }
                            });
                    }

                    function restore() {
                        templateType.restore().then(function (model) {
                            vm.model = model;
                            SweetAlert.swal(locale.getString('sweetalerts.restore_successful'), locale.getString('templates.types.restore_successful'), 'success');
                            vm.store.dispatch('getData');
                            $uibModalInstance.close();
                        }, function (response) {
                            SweetAlert.swal(locale.getString('sweetalerts.restore_not_successful'), response.data.message, 'error');
                        });
                    }

                    function close() {
                        $uibModalInstance.dismiss('close');
                    }
                }
            ],
            resolve: {
                templateType: function () {
                    return templateType
                },
                store: function () {
                    return vm.store
                },
            },
            controllerAs: 'vm'
        });

        modalInstance.result.then(function () {

        }, function (response) {
            if (response !== 'close') {
                Error.default(response);
            }
        });
    }

}