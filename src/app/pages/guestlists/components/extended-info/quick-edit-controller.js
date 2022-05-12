import rsvpModelReducer from '../../helpers/rsvp-model-reducer';
import contactModelReducer from '../../../contacts/helpers/contact-model-reducer.js';

export default class RsvpQuickEditController {
    constructor($uibModalInstance, $scope, $injector, rsvpId) {
        this.scope = $scope;
        this.modalInstance = $uibModalInstance;
        this.injector = $injector;
        this.rsvpId = rsvpId;
        this.hideCustomRsvpCode = true;

        this.error = this.injector.get('Error');
        this.alert = this.injector.get('Alert');

        this.api = this.injector.get('$http');
        this.depositService = this.injector.get('Deposit');
        this.filter = this.injector.get('$filter');
        this.rootScope = this.injector.get('$rootScope');

        this.loading = true;
        this.model = {rsvp: {}, contact: {}};
        this.guestlistInformation = {};

        this.deposits = {
            countries: {},
            languages: {},
            genders: {},
            states: {}
        };
        this.submitting = false;
        this._init();
    }

    _init() {
        this._loadDeposits();
        return this._loadRsvp().then(() => {
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
        });
    }

    _loadRsvp() {
        this.loading = true;
        this.model = {rsvp: {}, contact: {}};

        return this.api.get(`rsvps/${this.rsvpId}?include=guestlist,contact`).then((response) => {
            this.loading = false;
            this.model.rsvp = rsvpModelReducer(_.get(response, 'data.data'), _.get(response, 'data.data.guestlist.data')) /*['guestlist', 'contact']);*/
            this.model.contact = contactModelReducer(_.get(response, 'data.data.contact.data'), this.injector.get('Users').state.company);
            this.guestlistInformation = _.get(response, 'data.data.guestlist.data');
        });
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
        if (!form.$valid) {
            return;
        }
        this.submitting = true;

        if (!this.model.pax_planned || this.model.pax_planned < 1) {
            this.model.pax_planned = 1;
        }

        const contactData = _.clone(this.model.contact),
            rsvpData = _.clone(this.model.rsvp);

        this.api.put(`contacts/${this.model.contact.id}`, contactData).then((response) => {
            const contact = response.data.data;
            rsvpData.contact_id = contact.id;

            this.api.put(`rsvps/${this.model.rsvp.id}`, rsvpData).then((response) => {
                this.modalInstance.close({
                    contact: contact,
                    rsvp: response.data.data
                });
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

    cancel() {
        this.modalInstance.dismiss();
    };
}

RsvpQuickEditController.$inject = [
    '$uibModalInstance',
    '$scope',
    '$injector',
    'rsvpId'
];
