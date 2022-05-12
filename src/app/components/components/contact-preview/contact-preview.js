import template from './contact-preview.tpl.html';
import singleEmailTemplate from '../../../pages/contacts/views/workflows/send-single-email.tpl.html'
import {singleEmailCtrl} from '../../../pages/contacts/workflows/detailed-view/contact/single-email-controller';
import customSubscriptionTemplate from '../../../store/contacts/views/extended-customs/subscription.tpl.html';
import customPrefEmailTemplate from './customs/pref_email.tpl.html';

class ContactPreviewCtrl {
    constructor(Alert, $uibModal, $http, $state, $stateParams, $rootScope, locale, Acl) {
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
        this.modal = $uibModal;
        this.locale = locale;
        this.acl = Acl;
        this.params = _.cloneDeep($stateParams);
        this.specialViews = {
            subscription: customSubscriptionTemplate,
            'preferred-email': customPrefEmailTemplate
        };
        this.specialView = null;

        const settingSpecialView = _.get($rootScope.user, 'company.data.settings.companies.special_views.contact-preview');
        if (settingSpecialView
            && Object.keys(this.specialViews).indexOf(settingSpecialView) !== -1) {
            this.specialView = this.specialViews[settingSpecialView];
        }
    }

    sendEmail() {
        const ctrl = this;
        this.modal.open({
            templateUrl: singleEmailTemplate,
            controller: ['Alert', '$http', 'contact', '$scope', 'Templates', '$uibModalInstance', '$sce', singleEmailCtrl],
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                contact() {
                    return ctrl.contact;
                }
            }
        })
            .result.then(null, err => this.alert.handle(err));
    }

    $onInit() {
        this.delete = _.includes(this.store.getters.slug, 'picklist') ? this.confirmNRemove : this.confirmNDelete;
        this.localeSubscriptionStatus();
    }

    localeSubscriptionStatus() {
        this.contact.main_subscription_status = this.contact.main_subscription_status ? this.locale.getString('profile.' + this.contact.main_subscription_status) : '';
    }

    show() {
        return this.state.go('app.contacts.details', {
            id: this.contact.id,
            contact: this.contact,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    edit() {
        return this.state.go('app.contacts.edit', {
            id: this.contact.id,
            contact: this.contact,
            skipReload: true,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    confirmNRemove() {
        this.alert.confirm({
            title: 'Confirm Removal From Picklist',
            message: `Please confirm you want to remove ${ this.contact.full_name || this.contact.first_name + ' ' + this.contact.last_name } from this picklist?`,
            type: 'warning',
            confirmBtn: 'Remove',
            wait: true,
        })
            .then(() => {
                this.api.delete('picklists/contacts', {
                    data: {
                        picklists: {
                            count: 1,
                            filters: [
                                {
                                    field: 'id',
                                    operator: 'IN',
                                    value: [this.params.pid]
                                }
                            ]
                        },
                        contacts: {
                            count: 1,
                            filters: [
                                {
                                    field: 'id',
                                    operator: 'IN',
                                    value: [this.contact.id]
                                }
                            ]
                        },
                    }
                })
                    .then(() => {
                        if (this.store) {
                            this.store.dispatch('getData');
                        }
                        return this.alert.success(`Successfully moved ${ this.contact.full_name } to trash`);
                    }, err => this.alert.handle(err));
            }, err => this.alert.handle(err));
    }

    confirmNDelete() {
        this.alert.confirm({
            title: 'Confirm Deletion',
            message: `Please confirm you want to move ${ this.contact.full_name || this.contact.first_name + ' ' + this.contact.last_name } to trash?`,
            type: 'warning',
            confirmBtn: 'Delete',
            wait: true,
        })
            .then(() => {
                this.api.delete(`contacts/${ this.contact.id}`)
                    .then(() => {
                        if (this.store) {
                            this.store.dispatch('getData');
                        }
                        return this.alert.success(`Successfully moved ${ this.contact.full_name } to trash`);
                    }, err => this.alert.handle(err));
            }, err => this.alert.handle(err));
    }

}

angular
    .module('airlst.components')
    .component('contactPreview', {
        bindings: {
            contact: '<',
            store: '<',
            hideActions: '<'
        },
        controller: ['Alert', '$uibModal', '$http', '$state', '$stateParams', '$rootScope', 'locale', 'Acl', ContactPreviewCtrl],
        controllerAs: 'vm',
        templateUrl: template
    });
