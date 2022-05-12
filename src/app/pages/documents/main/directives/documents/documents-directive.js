import template from './documents-directive.tpl.html';
import editorModalTemplate from './views/editor-modal.tpl.html';
import './controllers/create-modal-controller';
/**
 * @ngdoc directive
 * @name documents.main.directive:documents
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <documents contact-id='' rsvp-id=''></documents>
 *
 */
angular
    .module('airlst.documents.main')
    .directive('documents', DocumentsDirective);

function DocumentsDirective() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: [
            'locale',
            '$scope',
            '$uibModal',
            'SweetAlert',
            '$http',
            'Env',
            'Document',
            DocumentsDirectiveCtrl
        ],
        bindToController: {
            contactId: '=',
            rsvpId: '='
        }
    };
}

function DocumentsDirectiveCtrl(locale, $scope, $uibModal, SweetAlert, $http, Env, Document) {
    var vm = this;

    vm.documents = [];
    vm.mode = -1;
    vm.limitToShow = 10;
    vm.loading = true;

    vm.newDocument = newDocument;
    vm.deleteDocument = deleteDocument;
    vm.downloadDocument = downloadDocument;

    init();

    function init() {
        locale.ready(['documents']).then(function () {
            initWatchers();
            reInitListView();
        });
    }

    function initWatchers() {
        $scope.$watch('vm.contactId', function () {
            reInitListView();
        });

        $scope.$watch('vm.rsvpId', function () {
            reInitListView();
        });
    }

    function reInitListView() {
        vm.loading = true;
        vm.error = false;
        vm.errorMessage = '';
        if (typeof vm.rsvpId !== 'undefined') {
            vm.mode = 2;
            vm.model = Document.setRsvpId(vm.rsvpId);
        } else if (typeof vm.contactId !== 'undefined') {
            vm.mode = 1;
            vm.model = Document.setContactId(vm.contactId);
        } else {
            vm.mode = -1;
            vm.error = true;
            vm.errorMessage = 'No Main model given';
            vm.manager = null;
            vm.loading = false;
            return;
        }

        vm.model.getList().then(function (result) {
            vm.documents = result;
            vm.loading = false;
        }, function (e) {
            vm.loading = false;
            vm.error = true;
            vm.errorMessage = 'loading while loading documents: ' + e;
        });
    }

    function newDocument() {
        var modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal--title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: editorModalTemplate,
            size: 'sm',
            controller: 'DocumentCreateModalCtrl',
            controllerAs: 'vm',
            resolve: {
                model: function () {
                    return vm.model;
                },
                closeFunction: function () {
                    return function () {
                        modal.close();
                        reInitListView();
                    };
                }
            }
        });
    }

    function downloadDocument(document) {
        Document.download(document);
    }

    function deleteDocument(document) {
        SweetAlert.swal({
                title: "Delete?",
                text: "Are you sure to delete this document?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function (isConfirmed) {
                if (isConfirmed) {
                    $http.delete(Env.apiUrl.concat('/documents/', document.id), {}).then(function () {
                        SweetAlert.success('Deleted', 'Document was deleted successful');
                        reInitListView();
                    }, function (response) {

                    });
                }
            });
    }
}