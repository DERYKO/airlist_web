import template from './invoice-payments-directive.tpl.html';
import editorModalTemplate from './../../views/payments/editor-modal.tpl.html';

/**
 * @ngdoc directive
 * @name billing.invoices.directive:invoice-payments
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <invoice-payments invoice=''></contact-invoices>
 *
 */
angular
    .module('airlst.billing.invoices')
    .directive('invoicePayments', InvoicesPaymentsDirective);

function InvoicesPaymentsDirective() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: [
            '$scope',
            'locale',
            '$uibModal',
            'SweetAlert',
            'Error',
            'Invoice',
            '$injector',
            InvoicesPaymentsDirectiveController
        ],
        bindToController: {
            invoice: '='
        }
    };
}

function InvoicesPaymentsDirectiveController($scope, locale, $uibModal, SweetAlert, Error, Invoice, $injector) {
    const vm = this;

    vm.payments = [];
    vm.showTable = false;
    vm.invalidInvoice = false;
    vm.alreadyPaidAmount = 0;

    vm.createPayment = createPayment;
    vm.editPayment = editPayment;
    vm.deletePayment = deletePayment;

    init();

    function init() {
        locale.ready(['billing']).then(function () {
            initWatchers();
        });
    }

    function initWatchers() {
        $scope.$watch('vm.invoice', function () {
            reloadPayments();
        });
    }

    function reloadPayments() {
        if (typeof vm.invoice !== 'undefined' && typeof vm.invoice.id !== 'undefined') {
        }
    }

    function createPayment() {
        const modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: editorModalTemplate,
            size: 'md',
            controller: 'InvoicesPaymentCreateModalCtrl',
            controllerAs: 'vm',
            resolve: {
                invoice: function () {
                    return vm.invoice;
                },
                alreadyPaidAmount: function () {
                    return vm.alreadyPaidAmount;
                },
                closeFunction: function () {
                    return function () {
                        reloadPayments();
                        modal.close();
                    };
                }
            }
        });
    }

    function editPayment(payment) {
        const modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: editorModalTemplate,
            size: 'md',
            controller: 'InvoicesPaymentEditModalCtrl',
            controllerAs: 'vm',
            resolve: {
                invoice: function () {
                    return vm.invoice;
                },
                payment: vm.invoice.get('payments/' + payment.id),
                closeFunction: function () {
                    return function () {
                        reloadPayments();
                        modal.close();
                    };
                }
            }
        });
    }

    function deletePayment(payment) {
        SweetAlert.swal({
                title: "Delete?",
                text: "Are you sure to delete this payment?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function (isConfirmed) {
                if (isConfirmed) {
                    return Invoice.one(vm.invoice.id).customDELETE('payments/' + payment.id).then(function (response) {
                        SweetAlert.success('Deleted', 'payment deleted');
                        reloadPayments();
                    }, function (e) {
                        Error.default(e);
                    });
                }
            });
    }
}