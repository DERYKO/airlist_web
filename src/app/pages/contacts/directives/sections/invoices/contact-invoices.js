
import templateUrl from './contact-invoices.tpl.html';
import createModalTemplate from '../../../../billing/invoices/views/create-modal.tpl.html';

class ContactInvoicesCtrl {

    constructor(Invoice, $injector, $state, Invoices) {
        this.model = Invoice;
        this.injector = $injector;
        this.state = $state;
        this.uibModal = $injector.get('$uibModal');
        this.invoicesStore = Invoices;
    }

    $onInit() {
        this.store = this.invoicesStore.reset({
            persists: false,
            listview: 'Contact' + this.contact.id + 'DetailsInvoices'
        });
        this.store.dispatch('loadWorkflows', 'billing::invoice-list');
        this.store.commit('setVisible', [
            'subject',
            'template.title',
            'invoice_number',
            'status'
        ]);
        this.store.commit('setPrefix', 'billing/contacts/' + this.contact.id);
        // this.store.commit('addAction', {
        //     key: 'new_invoice',
        //     title: 'New Invoice',
        //     icon: 'plus-circle',
        //     level: 'highlight',
        //     vm: 'createNewInvoice'
        // });
        // this.store.commit('addAction', {
        //     key: 'new_bid',
        //     title: 'New Bid',
        //     icon: 'plus-circle',
        //     level: 'highlight',
        //     vm: 'createNewBid'
        // });
        // this.store.commit('addAction', {
        //     key: 'new_cancellation',
        //     title: 'New Cancellation',
        //     icon: 'plus-circle',
        //     level: 'highlight',
        //     vm: 'createNewCancellation'
        // });

        this.store.commit('setVm', this);
    }

    createNewInvoice() {
        this.createNewDocument('invoice');
    }

    createNewBid() {
        this.createNewDocument('bid');
    }

    createNewCancellation() {
        this.createNewDocument('cancellation');
    }

    createNewDocument(type) {
        const modal = this.uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: createModalTemplate,
            size: 'lg',
            controller: 'InvoicesCreateModalCtrl',
            controllerAs: 'vm',
            resolve: {
                type: () => {
                    return type;
                },
                contactId: () => {
                    return this.contact.id;
                },
                closeFunction: () => {
                    return () => {
                        this.store.dispatch('getData');
                        modal.close();
                    };
                }
            }
        });
    }

    showDetails(action) {
        this.state.go('app.billing.invoices.details', {id: action.row.id});
    }
}


ContactInvoicesCtrl.$inject = ['Invoice', '$injector', '$state', 'Invoices'];


angular
    .module('airlst.contacts')
    .component('contactInvoices', {
        bindings: {
            contact: '='
        },
        controller: ContactInvoicesCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });
