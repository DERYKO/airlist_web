import template from './position_links-directive.tpl.html';
import editorModalTemplate from './views/editor-modal.tpl.html';

import './controllers/create-modal-controller';
import './controllers/edit-modal-controller';
/**
 * @ngdoc directive
 * @name billing.position_links.directive:position_links
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <position-links billable-type='' billable-id=''></position_links>
 *
 */
angular
    .module('airlst.billing.position_links')
    .directive('positionLinks', PositionLinksDirective)

function PositionLinksDirective() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: [
            'locale',
            'Restangular',
            '$scope',
            '$uibModal',
            'SweetAlert',
            '$http',
            'Env',
            PositionLinksDirectiveCtrl
        ],
        bindToController: {
            billableType: '=',
            billableId: '=',
            pax: '='
        }
    };
}

function PositionLinksDirectiveCtrl(locale, Restangular, $scope, $uibModal, SweetAlert, $http, Env) {
    var vm = this;

    vm.positionLinks = [];

    vm.newPositionLink = newPositionLink;
    vm.editPositionLink = editPositionLink;
    vm.deletePositionLink = deletePositionLink;

    init();

    function init() {
        locale.ready(['billing']).then(function () {
            initWatchers();
        });
    }

    function initWatchers() {
        $scope.$watch('vm.billableId', function () {
            reloadLinks();
        });
    }

    function reloadLinks() {
        vm.positionLinks = [];
        if (vm.billableId && vm.billableType) {
            Restangular.all('billing/positions/links/for-billable/' + vm.billableType + '/' + vm.billableId).getList().then(function (result) {
                _.forEach(result, function (v, k) {
                    vm.positionLinks.push(v.plain());
                });
            })
        }
    }

    function newPositionLink() {
        var modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal--title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: editorModalTemplate,
            size: 'sm',
            controller: 'PositionLinksCreateModalCtrl',
            controllerAs: 'vm',
            resolve: {
                billableId: function () {
                    return vm.billableId;
                },
                billableType: function () {
                    return vm.billableType;
                },
                pax: function () {
                    return vm.pax;
                },
                closeFunction: function () {
                    return function () {
                        modal.close();
                        reloadLinks();
                    };
                }
            }
        });
    }

    function editPositionLink(position) {
        if (position.already_invoiced) {
            SweetAlert.error('already invoiced', 'the given position is already used in an invoice. no changes possbile');
            return;
        }

        if (position.already_in_use) {
            SweetAlert.swal({
                    title: "Already in use",
                    text: "The position is already used in minimum one document. all changes will be written to the documents too",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, edit!",
                    closeOnConfirm: true
                },
                function (isConfirmed) {
                    if (isConfirmed) {
                        startEdit(position);
                    }
                });
        } else {
            startEdit(position);
        }
    }

    function startEdit(position) {
        var modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal--title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: editorModalTemplate,
            size: 'sm',
            controller: 'PositionLinksEditModalCtrl',
            controllerAs: 'vm',
            resolve: {
                position: function () {
                    var valueToEdit = _.cloneDeep(position);
                    delete valueToEdit.already_invoiced;
                    return valueToEdit;
                },
                closeFunction: function () {
                    return function () {
                        modal.close();
                        reloadLinks();
                    };
                }
            }
        });
    }

    function deletePositionLink(position) {
        if (position.already_invoiced) {
            SweetAlert.error('already invoiced', 'the given position is already used in an invoice. no changes possbile');
            return;
        }

        if (position.already_in_use) {
            SweetAlert.swal({
                    title: "Alread used",
                    text: "Are you sure to delete this position link? It is already used in several documents and will be deleted from them too",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function (isConfirmed) {
                    if (isConfirmed) {
                        $http.delete(Env.apiUrl.concat('/billing/positions/links/', position.id), {}).then(function () {
                            SweetAlert.success('Deleted', 'Deleted position link');
                            reloadLinks();
                        }, function (response) {

                        });
                    }
                });
        } else {
            SweetAlert.swal({
                    title: "Delete?",
                    text: "Are you sure to delete this position link?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function (isConfirmed) {
                    if (isConfirmed) {
                        $http.delete(Env.apiUrl.concat('/billing/positions/links/', position.id), {}).then(function () {
                            SweetAlert.success('Deleted', 'Deleted position link');
                            reloadLinks();

                        }, function (response) {

                        });

                        return false;
                    }
                });
        }
    }
}