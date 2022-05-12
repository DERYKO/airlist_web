import BaseExtendedListViewController from '../../base/controllers/extended-list-view';
import singleEmailTemplate from '../../../pages/guestlists/views/workflows/send-single-email.tpl.html';
import {singleEmailCtrl} from '../../../pages/guestlists/workflows/general/detailed/controllers/single-email-controller';
import customKomsaTemplate from '../views/extended-overview-customs/komsa.tpl.html';
import customMbdaTemplate from '../views/extended-overview-customs/mbda.tpl.html';
import airportPaybackTemplate from '../views/extended-overview-customs/airport-payback.tpl.html';
import customSubscriptionTemplate from '../../contacts/views/extended-customs/subscription.tpl.html';
import RsvpQuickEditController from '../../../pages/guestlists/components/extended-info/quick-edit-controller';
import quickEditModalTemplate
    from './../../../pages/guestlists/workflows/heart-me/rsvps-create-a-contact-and-add-rsvp.tpl.html';
import rsvpModelReducer from '../../../pages/guestlists/helpers/rsvp-model-reducer';

import rsvpQrCodeModalTemplate from '../views/qr-code-modal.tpl.html';
import QrCodeController from './qr-code-controller';

import checkInRsvpTemplate from '../../../components/modals/checkin-modal/template.tpl.html';
import CheckInModalController from '../../../components/modals/checkin-modal/controller';

export default class RsvpsExtendedListViewCtrl extends BaseExtendedListViewController {
    constructor(model, $injector, $scope) {
        super(model, $injector, $scope);
        this.modal = $injector.get('$uibModal');
        this.rootScope = $injector.get('$rootScope');
        this.resourceSelect = $injector.get('ResourceSelect');
        this.alert = $injector.get('Alert');
        this.parameters = {
            include: 'lastMessage,contact,guestlist'
        };

        this.setupContactSpecialViews();
        this.setupRsvpSpecialViews();
    }

    loadData() {
        return super.loadData().then(() => {
            this.updateAvailableViews();
            this.contact = this.model.contact.data;
        });
    }

    updateAvailableViews() {
        this.availableViews = [
            {
                key: 'overview',
                label: 'Overview'
            },
            {
                key: 'booking',
                label: 'Booking'
            }
        ];

        if (this.acl.hasRight('messages::view') && this.acl.hasRight('messages::list')) {
            this.availableViews.push({
                key: 'messages',
                label: 'Messages'
            });
        }

        if (this.model.guestlist.data.settings.enable_guests) {
            this.availableViews.push({
                key: 'guests',
                label: 'Guests'
            });
        }

    }

    sendEmail() {
        const rsvpToSend = this.model;
        this.modal.open({
            templateUrl: singleEmailTemplate,
            controller: ['Alert', '$http', 'rsvp', '$scope', 'Templates', '$uibModalInstance', '$sce', singleEmailCtrl],
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                rsvp() {
                    return rsvpToSend;
                }
            }
        }).result.then(null, err => this.alert.handle(err));
    }

    viewRsvp() {
        this.state.go('app.guestlists.rsvps.details', {
            gid: this.model.guestlist_id,
            id: this.model.id,
            rsvp: this.model,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    changeRsvpStatus() {
        this.resourceSelect.selectStatus(this.model.status).then((response) => {
            const selectedStatus = response.selectedStatus;

            this.api.put(`rsvps/${this.model.id}`, {
                ...rsvpModelReducer(this.model, this.model.guestlist.data),
                status: selectedStatus
            }).then(() => {
                this.alert.success('Status updated', 'Updated rsvp status');
                this.loadData();
                if (this.store) {
                    this.store.dispatch('getData');
                }
            }, () => {
                this.alert.error('Status update failed', 'Please try again')
            });
        }, () => {

        });
    }

    editRsvp() {
        this.state.go('app.guestlists.rsvps.edit', {
            gid: this.model.guestlist_id,
            id: this.model.id,
            rsvp: this.model,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    quickEditRsvp() {
        this.modal.open({
            templateUrl: quickEditModalTemplate,
            controllerAs: 'vm',
            controller: RsvpQuickEditController,
            size: 'md',
            resolve: {
                rsvpId: () => {
                    return this.model.id;
                }
            }
        }).result.then(() => {
            this.alert.success('Success', 'The changes have been saved');
            this.loadData();
            if (this.store) {
                this.store.dispatch('getData');
            }
        }, () => {
            this.loadData();
        });
    }

    confirmNDeleteRsvp() {
        this.alert.confirm({
            title: 'Confirm Deletion',
            message: `Do you really want to delete this guest? Please note that guests of guest are also deleted if they are attached.`,
            type: 'warning',
            confirmBtn: 'Delete',
            wait: true,
        })
            .then(() => {
                this.api.delete(`rsvps/${this.model.id}`)
                    .then(() => {
                        if (this.store) {
                            this.store.dispatch('getData');
                        }
                        return this.alert.success(`Successfully deleted rsvp`);
                    }, err => this.alert.handle(err));
            }, err => this.alert.handle(err));
    }

    getObjectVar(object, path) {
        return _.get(object, path);
    }

    prepareLabelForField(field) {
        if (field.label) {
            return field.label;
        }

        let label = field.slug.replace('.', ' ') + '';

        if (label.length > 0) {
            label = label.charAt(0).toUpperCase() + label.slice(1);
        }

        return label;
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

    setupRsvpSpecialViews() {
        this.specialRsvpViews = {
            komsa: customKomsaTemplate,
            mbda: customMbdaTemplate,
            'airport-payback': airportPaybackTemplate
        };
        this.specialRsvpView = null;

        const settingSpecialView = _.get(this.rootScope.user, 'company.data.settings.companies.special_views.rsvp-preview-overview');
        if (settingSpecialView
            && Object.keys(this.specialRsvpViews).indexOf(settingSpecialView) !== -1) {
            this.specialRsvpView = this.specialRsvpViews[settingSpecialView];
        }
    }

    quickAddGuest() {
        const action = this.injector.get('quickAddContact');

        action.action({}, {
            dispatch: () => {
                this.loadData();
            },
            state: {
                permanentFilters: {
                    guestlist_id: this.model.guestlist_id,
                    parent_rsvp_id: this.model.id
                }
            }
        });
    }

    showRsvpQrCode() {
        this.modal.open({
            controller: QrCodeController,
            controllerAs: 'vm',
            templateUrl: rsvpQrCodeModalTemplate,
            size: 'sm',
            resolve: {
                code: () => {
                    return this.model.code;
                }
            }
        }).result.then(() => {

        }, () => {

        });
    }

    checkInRsvp() {
        this.modal.open({
            templateUrl: checkInRsvpTemplate,
            controllerAs: 'vm',
            size: 'sm',
            controller: CheckInModalController,
            resolve: {
                rsvp: () => {
                    return this.model;
                }
            }
        }).result.then(pax_actual => {
            this.api.post(`rsvps/${this.model.id}/checkin`, {pax_actual}).then(() => {
                this.alert.success('Update successful');
                this.loadData();
                if (this.store) {
                    this.store.dispatch('getData');
                }
            }, response => this.alert.handle(response));
        }, response => this.alert.handle(response));
    }
}
