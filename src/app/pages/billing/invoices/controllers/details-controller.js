import updateAddressModalTemplate from '../views/update-address-modal.tpl.html';
import cancelInvoiceModalTemplate from '../views/cancel-invoice-modal.tpl.html';
import paymentEditorModalTemplate from '../views/payments/editor-modal.tpl.html';
import editModalTemplate from '../views/edit-modal.tpl.html';
import Payments from '../../../../store/billing/payments/index';

/**
 * @ngdoc object
 * @name billing.invoices.controller:InvoiceDetailsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoiceDetailsCtrl', [
        'locale',
        '$state',
        '$stateParams',
        'SweetAlert',
        'Invoice',
        '$uibModal',
        'Error',
        'Payments',
        'NavService',
        DetailsCtrl
    ]);

function DetailsCtrl(locale, $state, $stateParams, SweetAlert, Invoice, $uibModal, Error, Payments, NavService) {
    const vm = this;

    vm.manager = $stateParams.store;
    if (vm.manager) {
        vm.refresh = vm.manager.refresh;
    }

    vm.closeInvoice = closeInvoice;
    vm.editInvoice = editInvoice;
    vm.downloadInvoice = downloadInvoice;
    vm.sendInvoice = sendInvoice;
    vm.deleteInvoice = deleteInvoice;
    vm.updateAddress = updateAddress;
    vm.finishInvoice = finishInvoice;

    init();

    function init() {
        if ($stateParams.store) {
            vm.manager = $stateParams.store;
        }
        vm.paymentsStore = null;

        loadInvoice();
    }

    function loadInvoice() {
        vm.paymentsStore = null;
        Invoice.one($stateParams.id).get({include: 'contact,payments'}).then(function (record) {
            vm.invoice = record;
            _updateCustomActions();
            loadPayments();
            return record;
        }, function () {
            SweetAlert.swal(locale.getString('billing.invoices.not_found'), locale.getString('billing.invoices.not_found_message'), 'error');
            closeInvoice();
        });
    }

    function loadPayments() {
        vm.paymentsStore = Payments.reset({
            persist: false,
            listview: 'Invoice' + vm.invoice.id + 'PaymentsListView',
            overrideSideNavActions: false
        });
        vm.paymentsStore.commit('setPrefix', 'billing/invoices/' + vm.invoice.id);
        vm.paymentsStore.commit('addAction', {
            key: 'show_payment_model',
            text: 'Edit',
            level: 'row',
            action: function (action) {
                editPayment(action.row.id);
            }
        });
        vm.paymentsStore.commit('setVm', vm);
    }

    function closeInvoice() {
        $state.go('app.billing.invoices.index');
    }

    function editInvoice() {
        if (vm.invoice.type === 'invoice' && vm.invoice.status !== 'draft') {
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
                        startInvoiceEditor(vm.invoice).result.then(function(newInvoice){
                            console.log(newInvoice);
                            loadInvoice();
                        }, function() {
                            loadInvoice();
                        });
                    }
                });
        } else {
            startInvoiceEditor(vm.invoice).result.then(function(newInvoice){
                console.log(newInvoice);
                loadInvoice();
            }, function() {
                loadInvoice();
            });;
        }
    }

    function startInvoiceEditor(invoice) {
        const modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: editModalTemplate,
            size: 'lg',
            controller: 'InvoicesEditModalCtrl',
            controllerAs: 'vm',
            resolve: {
                contactId: function () {
                    return vm.invoice.contact_id;
                },
                invoice: function () {
                    return Invoice.one(invoice.id).get({include: 'positions,positions.position_link,subscriptionInvoice'}).then(function (response) {
                        return response;
                    }, function () {
                        SweetAlert.error(locale.getString('billing.invoices.not_found'), locale.getString('billing.invoices.not_found_message'));
                        // reloadInvoices();
                    });
                }
            }
        });

        return modal;
    }

    function downloadInvoice() {
        if (vm.invoice.status === 'draft') {
            return Invoice.downloadInvoice(vm.invoice.id, 'invoice-' + vm.invoice.id + '-draft.pdf');
        } else {
            return Invoice.downloadInvoice(vm.invoice.id, 'invoice-' + vm.invoice.invoice_number + '.pdf');
        }
    }

    function sendInvoice() {
        return Invoice.sendInvoice(vm.invoice, vm.invoice.contact.data);
    }

    function finishInvoice() {
        return Invoice.finishInvoice(vm.invoice).then(function (invoice) {
            loadInvoice();
        });
    }

    function cancelInvoice() {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: cancelInvoiceModalTemplate,
            size: 'md',
            controller: 'InvoicesCancelModalCtrl',
            controllerAs: 'vm',
            resolve: {
                invoice: function () {
                    return vm.invoice;
                }
            }
        }).result.then(function(cancellation) {
            loadInvoice();
            SweetAlert.success('Success', 'Cancellation was created');
        }, function (close) {
            if(close !== true) {
                Error.default(close);
            }
        });
    }

    function deleteInvoice() {
        return Invoice.one(vm.invoice.id).remove().then(function (response) {
            SweetAlert.info('Success', 'Invoice deleted');
            closeInvoice();
        }, function (e) {
            Error.default(e);
        });
    }

    function updateAddress() {
        const modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: updateAddressModalTemplate,
            size: 'sm',
            controller: 'InvoicesUpdateAddressModalCtrl',
            controllerAs: 'vm',
            resolve: {
                contactId: function () {
                    console.log(vm.invoice);
                    return vm.invoice.contact.data.id;
                },
                invoiceId: function () {
                    return vm.invoice.id;
                },
                closeFunction: function () {
                    return function () {
                        loadInvoice();
                        modal.close();
                    };
                }
            }
        });
    }

    function createPayment() {
        const modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: paymentEditorModalTemplate,
            size: 'md',
            controller: 'InvoicesPaymentCreateModalCtrl',
            controllerAs: 'vm',
            resolve: {
                invoice: function () {
                    return vm.invoice;
                },
                closeFunction: function () {
                    return function () {
                        loadInvoice();
                        modal.close();
                    };
                }
            }
        });
    }

    function editPayment(paymentId) {
        const modal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: paymentEditorModalTemplate,
            size: 'md',
            controller: 'InvoicesPaymentEditModalCtrl',
            controllerAs: 'vm',
            resolve: {
                invoice: function () {
                    return vm.invoice;
                },
                payment: vm.invoice.customGET('payments/' + paymentId),
                closeFunction: function () {
                    return function () {
                        loadInvoice();
                        modal.close();
                    };
                }
            }
        });
    }

    function _updateCustomActions() {
        let customActions = [];

        if (vm.invoice.status !== 'draft' && vm.invoice.contact.data.preferred_email) {
            customActions.push({
                label: 'Send',
                action: function () {
                    vm.sendInvoice();
                },
                icon: 'envelope',
                order: 5
            });
        }

        customActions.push({
            label: 'Download',
            action: function () {
                vm.downloadInvoice();
            },
            icon: 'upload',
            order: 10
        });

        if (vm.invoice.status === 'bid' || vm.invoice.status === 'draft') {
            customActions.push({
                label: 'Edit',
                action: function () {
                    vm.editInvoice();
                },
                icon: 'pencil',
                order: 15
            });
        }

        if ((vm.invoice.status === 'bid' && vm.invoice.status === 'draft') || vm.invoice.status === 'draft') {
            customActions.push({
                label: 'Delete',
                action: function () {
                    vm.deleteInvoice();
                },
                icon: 'trash',
                order: 40
            });
        }

        if (vm.invoice.status === 'draft') {
            customActions.push({
                label: 'Finish',
                action: function () {
                    vm.finishInvoice();
                },
                icon: 'check',
                order: 25
            });
        }


        if (vm.invoice.type === 'invoice'
            && vm.invoice.status !== 'paid'
            && vm.invoice.status !== 'cancelled'
            && vm.invoice.status !== 'draft') {
            customActions.push({
                label: 'Create Payment',
                action: function () {
                    createPayment();
                },
                icon: 'plus-circle',
                order: 30
            });
        }


        if (vm.invoice.type === 'invoice'
            && vm.invoice.status !== 'draft'
            && vm.invoice.status !== 'cancelled'
        ) {
            customActions.push({
                label: 'Cancel Invoice',
                action: function () {
                    cancelInvoice();
                },
                icon: 'times-circle',
                order: 35
            });
        }

        NavService.overrideMainSideNavActions(customActions);
        NavService.setBreadcrumbParameters({
            invoice: (!vm.invoice.invoice_number) ? 'Draft: ' + vm.invoice.contact.data.full_name : vm.invoice.invoice_number
        })
    }

}
