import modalTemplate from './rsvps-create-a-contact-and-add-rsvp.tpl.html';

class QuickAddContactWorkflow {
    constructor(Error, $uibModal, $http, SweetAlert, Alert) {
        this.error = Error;
        this.modal = $uibModal;
        this.api = $http;
        this.sweetAlert = SweetAlert;
        this.alert = Alert;

        this.key = 'quick-add-contact';
        this.title = 'Quick - Add Guest';
        this.level = 'highlight';
        this.order = 20;
        this.icon = 'plus-circle';
    }

    action(payload, store) {
        const guestlistId = _.get(store, 'state.permanentFilters.guestlist_id');
        if (guestlistId) {
            return this.modal.open({
                templateUrl: modalTemplate,
                controllerAs: 'vm',
                resolve: {
                    guestlistInformation: () => {
                        return this.loadGuestlistInformation(guestlistId).then((guestlistInformation) => {
                            return guestlistInformation;
                        }, (e) => {
                            this.error.default(e);
                        })
                    },
                    parentRsvpId: () => {
                        return _.get(store, 'state.permanentFilters.parent_rsvp_id');
                    }
                },
                controller: ['Error', '$http', '$uibModalInstance', 'Deposit', '$filter', 'guestlistInformation', '$rootScope', 'parentRsvpId', 'Alert', QuickAddContactModalController]
            }).result.then((response) => {
                this.sweetAlert.success('Booking saved');
                if (store) {
                    store.dispatch('getData');
                }
                return response.rsvp;
            }, (e) => {
                if (e && e !== 'escape key press') {
                    this.error.default(e);
                }
            });

        }
    }

    /**
     *
     */
    loadGuestlistInformation(guestlistId) {
        return this.api.get(`guestlists/${guestlistId}`).then((response) => {
            return response.data.data;
        }, (e) => {
            return e;
        })
    }
}

class QuickAddContactModalController {
    constructor(Error, $http, $uibModalInstance, Deposit, $filter, guestlistInformation, $rootScope, parentRsvpId, Alert) {
        this.error = Error;
        this.api = $http;
        this.modalInstance = $uibModalInstance;
        this.depositService = Deposit;
        this.filter = $filter;
        this.guestlistInformation = guestlistInformation;
        this.rootScope = $rootScope;
        this.alert = Alert;
        this.parentRsvp = null;

        this.model = {
            contact: {
                code: '',
                sex: 'unknown',
                addressbook: this.guestlistInformation.settings.add_contacts_to_addressbook
            },
            rsvp: {
                status: 'listed',
                pax_planned: 1,
                guestlist_id: this.guestlistInformation.id,
                parent_rsvp_id: parentRsvpId || null
            }
        };

        if (this.model.rsvp.parent_rsvp_id) {
            this._loadParentRsvp();
        }


        this.deposits = {
            countries: {},
            languages: {},
            genders: {},
            states: {}
        };
        this.submitting = false;

        this.rsvpCustomFields = _(this.guestlistInformation)
            .map((value, attr) => {
                if (attr.match(/custom_\d*_name/gi) && _.keys(value).length) {
                    value.key = attr.match(/custom_\d*/gi)[0];
                    return value;
                }
            })
            .filter()
            .value();

        this.contactCustomFields = _(this.rootScope.company)
            .map((value, attr) => {
                if (attr.match(/custom_\d*_name/gi) && _.keys(value).length) {
                    value.key = attr.match(/custom_\d*/gi)[0];
                    return value;
                }
            })
            .filter()
            .value();

        this.init();
    }

    init() {
        this._loadDeposits();
    }

    _loadDeposits() {
        this.depositService.getRemoteDeposit('contacts', 'countries', []).then((value) => {
            this.deposits.countries = value;
        });
        this.depositService.getRemoteDeposit('contacts', 'languages', []).then((value) => {
            this.deposits.languages = value;
        });
        this.depositService.getRemoteDeposit('contacts', 'genders', []).then((value) => {
            this.deposits.genders = value;
        });
        this.depositService.getRemoteDeposit('rsvps', 'states', []).then((value) => {
            this.deposits.states = value;
        });
    }

    isFieldEnabled(slug, searchPartial) {
        const fields = this.model.rsvp.parent_rsvp_id ? this.guestlistInformation.settings.registration_guest_fields : this.guestlistInformation.settings.registration_fields;
        return (this.filter('filter')(fields, {slug: slug}, !searchPartial).length > 0);
    }

    save(form) {
        this.submitting = true;

        if (!this.model.pax_planned || this.model.pax_planned < 1) {
            this.model.pax_planned = 1;
        }

        const contactData = _.clone(this.model.contact),
            rsvpData = _.clone(this.model.rsvp);

        this.api.post(`contacts`, contactData).then((response) => {
            const contact = response.data.data;
            rsvpData.contact_id = contact.id;

            this.api.post(`guestlists/${this.guestlistInformation.id}/rsvps`, rsvpData).then((response) => {
                this.modalInstance.close({
                    contact: contact,
                    rsvp: response.data.data
                })
            }, (e) => {
                this.submitting = false;
                this.alert.handle(e);
            }).finally(() => {
                this.submitting = false;
            })
        }, (e) => {
            this.submitting = false;
            this.alert.handle(e);
        });
    };

    _loadParentRsvp() {
        this.api.get(`rsvps/${this.model.rsvp.parent_rsvp_id}?include=contact`).then((response) => {
            this.parentRsvp = response.data.data;
        })
    }

    cancel() {
        this.modalInstance.dismiss();
    };
}


/**
 * @ngdoc service
 * @name checkins.factory:quickAddContact
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('quickAddContact', [
        'Error',
        '$uibModal',
        '$http',
        'SweetAlert',
        'Alert',
        (Error, $uibModal, $http, SweetAlert, Alert) => new QuickAddContactWorkflow(Error, $uibModal, $http, SweetAlert, Alert)
    ]);
