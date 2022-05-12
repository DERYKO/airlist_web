import template from './invoices-directive.tpl.html';
import updateAddressModalTemplate from '../../views/update-address-modal.tpl.html';
import paymentsModalTemplate from '../../views/payments-modal.tpl.html';
import createModalTemplate from '../../views/create-modal.tpl.html';
import editModalTemplate from '../../views/edit-modal.tpl.html';

/**
 * @ngdoc directive
 * @name billing.invoices.directive:invoices
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example <contact-invoices contact=''></contact-invoices>
 *
 */
angular
    .module('airlst.billing.invoices')
    .directive('contactInvoices', InvoicesDirective);

function InvoicesDirective() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: template,
        replace: false,
        controllerAs: 'vm',
        controller: [
            'Invoice',
            '$scope',
            'locale',
            '$uibModal',
            'SweetAlert',
            'Error',
            InvoicesDirectiveController
        ],
        bindToController: {
            contact: '=',
            contactId: '='
        }
    };
}

function InvoicesDirectiveController(Invoice, $scope, locale, $uibModal, SweetAlert, Error) {
    var vm = this;

    vm.invoices = [];

    vm.createNewInvoice = createNewInvoice;
    vm.createNewBid = createNewBid;
    vm.createNewCancellation = createNewCancellation;
    vm.editInvoice = editInvoice;
    vm.downloadInvoice = downloadInvoice;
    vm.sendInvoice = sendInvoice;
    vm.deleteInvoice = deleteInvoice;
    vm.showPayments = showPayments;
    vm.updateAddress = updateAddress;
    vm.finishInvoice = finishInvoice;


    init();

    function init() {
        locale.ready(['billing']).then(function () {
            initWatchers();
        });
    }

    function initWatchers() {
        $scope.$watch('vm.contact', function () {
            reloadInvoices();
        });
    }

    function reloadInvoices() {
        vm.invoices = [];
        if (typeof vm.contact.id !== 'undefined') {
            vm.contact.getList('invoices').then(function (result) {
                _.forEach(result, function (v, k) {
                    vm.invoices.push(v.plain());
                });
            })
        }
    }

    function createNewInvoice() {
        createNewDocument('invoice');
    }

    function createNewBid() {
        createNewDocument('bid');
    }

    function createNewCancellation() {
        createNewDocument('cancellation');
    }

    function createNewDocument(type) {
        var modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: createModalTemplate,
            size: 'lg',
            controller: 'InvoicesCreateModalCtrl',
            controllerAs: 'vm',
            resolve: {
                type: function () {
                    return type;
                },
                contactId: function () {
                    return vm.contact.id;
                },
                closeFunction: function () {
                    return function () {
                        reloadInvoices();
                        modal.close();
                    };
                }
            }
        });
    }

    function editInvoice(invoice) {
        if (invoice.type === 'invoice' && invoice.status !== 'draft') {
            SweetAlert.swal({
                    title: "Edit?",
                    text: "Are you sure you want to edit this invoice?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, edit it!",
                    closeOnConfirm: true
                },
                function (isConfirmed) {
                    if (isConfirmed) {
                        startInvoiceEditor(invoice);
                    }
                });
        } else {
            startInvoiceEditor(invoice);
        }
    }

    function startInvoiceEditor(invoice) {
        var modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: editModalTemplate,
            size: 'lg',
            controller: 'InvoicesEditModalCtrl',
            controllerAs: 'vm',
            resolve: {
                contactId: function () {
                    return vm.contact.id;
                },
                invoice: function () {
                    return Invoice.one(invoice.id).get({include: 'positions,positions.position_link'}).then(function (response) {
                        return response;
                    }, function () {
                        SweetAlert.error(locale.getString('billing.invoices.not_found'), locale.getString('billing.invoices.not_found_message'));
                        reloadInvoices();
                    });
                },
                closeFunction: function () {
                    return function () {
                        reloadInvoices();
                        modal.close();
                    };
                }
            }
        });
    }

    function showPayments(invoice) {
        var modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: paymentsModalTemplate,
            size: 'lg',
            controller: [
                'closeFunction',
                'invoice',
                function (closeFunction, invoice) {
                    var vm = this;

                    vm.invoice = invoice;

                    vm.close = close;

                    function close() {
                        closeFunction();
                    }
                }
            ],
            controllerAs: 'vm',
            resolve: {
                invoice: function () {
                    return Invoice.one(invoice.id).get({include: 'positions,positions.position_link'}).then(function (response) {
                        return response;
                    }, function () {
                        SweetAlert.error(locale.getString('billing.invoices.not_found'), locale.getString('billing.invoices.not_found_message'));
                        reloadInvoices();
                    });
                },
                closeFunction: function () {
                    return function () {
                        reloadInvoices();
                        modal.close();
                    };
                }
            }
        });
    }

    function downloadInvoice(invoice) {
        if (invoice.status === 'draft') {
            return Invoice.downloadInvoice(invoice.id, 'invoice-' + invoice.id + '-draft.pdf');
        } else {
            return Invoice.downloadInvoice(invoice.id, 'invoice-' + invoice.invoice_number + '.pdf');
        }
    }

    function sendInvoice(invoice) {
        return Invoice.sendInvoice(invoice, vm.contact);
    }

    function finishInvoice(invoice) {
        return Invoice.finishInvoice(invoice).then(function(){
            reloadInvoices();
        });
    }

    function deleteInvoice(invoice) {
        return Invoice.one(invoice.id).remove().then(function (response) {
            SweetAlert.info('Success', 'invoice deleted');
            reloadInvoices();
        }, function (e) {
            Error.default(e);
        });
    }

    function updateAddress(invoice) {
        var modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: updateAddressModalTemplate,
            size: 'sm',
            controller: 'InvoicesUpdateAddressModalCtrl',
            controllerAs: 'vm',
            resolve: {
                contactId: function () {
                    return vm.contact.id;
                },
                invoiceId: function () {
                    return invoice.id;
                },
                closeFunction: function () {
                    return function () {
                        reloadInvoices();
                        modal.close();
                    };
                }
            }
        });
    }
}