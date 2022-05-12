import templateUrl from './contact-subscriptions.tpl.html';
import createModalTemplate from '../../../../billing/subscriptions/views/create-modal.tpl.html';
import detailModalTemplate from '../../../../billing/subscriptions/views/details-modal.tpl.html';
import ContactSubscriptions from '../../../../../store/contacts/subscriptions/index';

class ContactSubscriptionsCtrl {

    constructor(Subscription, $injector) {
        this.model = Subscription;
        this.injector = $injector;
        this.uibModal = $injector.get('$uibModal');
    }

    $onInit() {
        this.loadInvoices();
    }


    loadInvoices() {
        this.store = new ContactSubscriptions(this.model, {injector: this.injector});
        this.store.commit('setPrefix', 'billing/contacts/' + this.contact.id);

        this.store.commit('addAction', {
            key: 'add_subscription',
            title: 'Add Subscription',
            icon: 'plus-circle',
            level: 'highlight',
            vm: 'addNew'
        });

        this.store.commit('addAction', {
            key: 'show_details',
            title: 'Show Details',
            level: 'row',
            vm: 'showDetails'
        });

        this.store.commit('setVm', this);
    }

    addNew() {
        this.uibModal.open({
            templateUrl: createModalTemplate,
            controller: 'ContactSubscriptionsComponentCreateModalController',
            controllerAs: 'vm',
            resolve: {
                contactId: () => {
                    return this.contact.id;
                }
            }
        }).result.then(() => {
            this.store.dispatch('getData');
        }, () => {
            this.store.dispatch('getData');
        });
    }


    showDetails(action) {
        this.uibModal.open({
            templateUrl: detailModalTemplate,
            controller: 'ContactSubscriptionsComponentDetailModalController',
            controllerAs: 'vm',
            resolve: {
                subscriptionId: () => {
                    return action.row.id;
                },
                contactId: () => {
                    return this.contact.id;
                }
            }
        }).result.then(() =>{
            this.store.dispatch('getData');
        }, () => {
            this.store.dispatch('getData');
        });
    }
}


ContactSubscriptionsCtrl.$inject = ['Subscription', '$injector'];


angular
    .module('airlst.contacts')
    .component('contactSubscriptions', {
        bindings: {
            contact: '='
        },
        controller: ContactSubscriptionsCtrl,
        controllerAs: 'vm',
        templateUrl: templateUrl
    });