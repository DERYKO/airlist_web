import rsvpModelReducer from '../../helpers/rsvp-model-reducer.js';
import contactModelReducer from '../../../contacts/helpers/contact-model-reducer.js';

/**
 * @ngdoc object
 * @name rsvps.controller:RsvpEditCtrl
 *
 * @description
 *
 */

class RsvpEditCtrl {
    constructor(Alert, Contact, $http, NavService, $stateParams, $state, Deposit, $rootScope, $injector) {

        this.state = $state;
        this.api = $http;
        this.alert = Alert;
        this.store = $stateParams.store;
        this.params = _.pick($stateParams, ['back', 'backParams']);
        this.depositService = Deposit;
        this.rootScope = $rootScope;
        this.navService = NavService;
        this.injector = $injector;

        this.deposits = {
            countries: {},
            languages: {},
            genders: {},
            states: {}
        };

        this.editView = _.get(this.rootScope.user, 'settings.core.use_light_version') ? 'light' : 'full';

        $http.get(`rsvps/${$stateParams.id}?include=contact,guestlist`)
            .then(response => {
                this.rsvp = rsvpModelReducer(_.get(response, 'data.data', {}), _.get(response, 'data.data.guestlist.data', {}));
                this.contact = contactModelReducer(_.get(response, 'data.data.contact.data', {}), this.injector.get('Users').state.company);

                this.guestlist = _.get(response, 'data.data.guestlist.data', {});

                this.customFields = _(this.guestlist)
                    .map((value, attr) => {
                        if (attr.match(/custom_\d*_name/gi) && _.keys(value).length) {
                            value.key = attr.match(/custom_\d*/gi)[0];
                            return value;
                        }
                    })
                    .filter()
                    .value();
                this._setToolboxActions();
            });

        this.close = this.navService.goBack;

        Contact.getSchema().then(schema => {
            this.schema = schema;
        });
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

    _setToolboxActions() {
        const self = this;
        this.navService.setGoBackAction(() => {
            return self.state.go(self.params.back, _.merge(self.params.backParams || {}, {
                id: self.rsvp.id,
                gid: self.rsvp.guestlist_id,
                store: self.store,
                rsvp: self.rsvp,
            }));
        });

        this.navService.setBreadcrumbParameters({
            guestlist_name: this.guestlist.name,
            rsvp: '#' + this.rsvp.code + ' (' + this.contact.full_name + ')'
        });

        this.navService.setStateParameters('app.guestlists.rsvps.details', {
            gid: parseInt(this.guestlist.id),
            id: this.rsvp.id
        });
    }

    save() {
        this.api.put(`contacts/${this.contact.id}`, this.contact)
            .then(() => {
                // check for pax_planned value and set it to 1 if is not set or if is 0
                if (this.rsvp.pax_planned == 0 || typeof this.rsvp.pax_planned === "undefined") {
                    this.rsvp.pax_planned = 1;
                }
                // console.log(this.rsvp.pax_planned);
                this.api.put(`rsvps/${this.rsvp.id}`, this.rsvp)
                    .then(() => {
                        this.alert.success('Rsvp Update', 'The rsvp details have successfully been updated');
                        this.close();
                    }, response => this.alert.handle(response));
            }, response => this.alert.handle(response));
    }

}

angular
    .module('airlst.guestlists')
    .controller('RsvpEditCtrl', [
        'Alert',
        'Contact',
        '$http',
        'NavService',
        '$stateParams',
        '$state',
        'Deposit',
        '$rootScope',
        '$injector',
        RsvpEditCtrl
    ]);

