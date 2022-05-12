import BaseExtendedListViewController from '../../base/controllers/extended-list-view';
import singleEmailTemplate from '../../../pages/contacts/views/workflows/send-single-email.tpl.html'
import {singleEmailCtrl} from '../../../pages/contacts/workflows/detailed-view/contact/single-email-controller';
import customSubscriptionTemplate from '../views/extended-customs/subscription.tpl.html';

export default class ContactCardCtrl extends BaseExtendedListViewController {
    constructor(model, $injector, $scope) {
        super(model, $injector, $scope);
        this.params = $injector.get('$stateParams');
        this.modal = $injector.get('$uibModal');
        this.parameters = {
            include: 'latestMessage,latestRsvp,latestRsvp.guestlist,picklists'
        };
        this.availableViews = [
            {
                key: 'overview',
                label: 'Overview'
            },
            {
                key: 'bookings',
                label: 'Bookings'
            }
        ];

        this.setupContactSpecialViews();
    }

    $onInit() {
        this.delete = _.includes(this.scope.vm.store.getters.slug, 'picklist') ? this.confirmNRemove : this.confirmNDelete;
    }

    loadData() {
        return super.loadData().then(() => {
            this.contact = this.model;
        });
    }

    openContactDetails() {
        return this.state.go('app.contacts.details', {
            id: this.model.id,
            contact: this.model,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    editContact() {
        return this.state.go('app.contacts.edit', {
            id: this.model.id,
            contact: this.model,
            skipReload: true,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    sendEmail() {
        this.modal.open({
            templateUrl: singleEmailTemplate,
            controller: ['Alert', '$http', 'contact', '$scope', 'Templates', '$uibModalInstance', '$sce', singleEmailCtrl],
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                contact: () => {
                    return this.model;
                }
            }
        })
            .result.then(null, err => this.alert.handle(err));
    }

    confirmNRemove() {
        this.alert.confirm({
            title: 'Confirm Removal From Picklist',
            message: `Please confirm you want to remove ${this.model.full_name || this.model.first_name + ' ' + this.model.last_name} from this picklist?`,
            type: 'warning',
            confirmBtn: 'Remove',
            wait: true,
        }).then(() => {
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
                                value: [this.model.id]
                            }
                        ]
                    },
                }
            }).then(() => {
                if (this.store) {
                    this.store.dispatch('getData');
                }
                return this.alert.success(`Successfully moved ${this.model.full_name} to trash`);
            }, err => this.alert.handle(err));
        }, err => this.alert.handle(err));
    }

    confirmNDelete() {
        this.alert.confirm({
            title: 'Confirm Deletion',
            message: `Please confirm you want to move ${this.model.full_name || this.model.first_name + ' ' + this.model.last_name} to trash?`,
            type: 'warning',
            confirmBtn: 'Delete',
            wait: true,
        }).then(() => {
            this.api.delete(`contacts/${this.model.id}`).then(() => {
                if (this.store) {
                    this.store.dispatch('getData');
                }
                return this.alert.success(`Successfully moved ${this.model.full_name} to trash`);
            }, err => this.alert.handle(err));
        }, err => this.alert.handle(err));
    }

    setupContactSpecialViews() {
        this.contactSpecialViews = {
            subscription: customSubscriptionTemplate
        };
        this.specialContactView = null;

        const settingSpecialView = _.get(this.rootScope.user, 'company.data.settings.companies.special_views.contact-preview');
        if (settingSpecialView
            && Object.keys(this.contactSpecialViews).indexOf(settingSpecialView) !== -1) {
            this.specialContactView = this.contactSpecialViews[settingSpecialView];
        }
    }
}
