class RsvpCreateCtrl {

    constructor(Alert, Contacts, $http, NavService, Rsvps, $state, $stateParams, Deposit, $rootScope) {

        this.api = $http;
        this.state = $state;
        this.alert = Alert;
        this.depositService = Deposit;
        this.rootScope = $rootScope;
        this.editView = _.get(this.rootScope.user, 'settings.core.use_light_version') ? 'light' : 'full';

        this.deposits = {
            states: {}
        };
        this._loadDeposits();
        $http.get(`guestlists/${ $stateParams.gid }`)
            .then(response => {
                this.guestlist = response.data.data;
                NavService.setBreadcrumbParameters({guestlist_name: this.guestlist.name});
                NavService.setGoBackAction(() => {
                    return this.state.go(this.back, this.params);
                });
                this.setup($stateParams, Contacts, Rsvps);
            });
    }

    _loadDeposits() {
        this.depositService.getRemoteDeposit('rsvps', 'states', []).then((value) => {
            this.deposits.states = value;
        });
    }

    setup($stateParams, Contacts, Rsvps) {
        this.params = $stateParams.backParams || {};
        this.params.gid = this.guestlist.id;
        this.contacts = $stateParams.contacts || Contacts.reset({persist: false});
        this.store = $stateParams.store;
        this.back = $stateParams.back;

        this.rsvps = {
            contacts: this.contacts.getters.selectedFilters,
            guestlists: {
                filters: [
                    {
                        field: 'id',
                        operator: 'IN',
                        value: [this.guestlist.id]
                    }
                ],
                count: 1
            },
            fields: {
                status: 'confirmed',
                pax_max: 0,
                pax_planned: 1,
                pax_actual: 0
            }
        };

        this.contactsSelector = {
            store: this.contacts,
            displayField: 'full_name',
            maxItems: 1000,
        }


        this.parentSelector = {
            store: Rsvps.create('SelectorRsvps').reset({
                persist: false,
                permanentFilters: {'guestlist.id': this.guestlist.id}
            }),
            displayField: 'contact.full_name'
        };


        this.customFields = _(this.guestlist)
            .map((value, attr) => {
                if (attr.match(/custom_\d*_name/gi) && _.keys(value).length) {
                    value.key = attr.match(/custom_\d*/gi)[0];
                    return value;
                }
            })
            .filter()
            .value();


    }

    save() {

        this.rsvps.contacts.count = this.rsvps.contacts.count || this.rsvps.contacts.filters[0].value.length;

        // check for pax_planned value and set it to 1 if is not set or if is 0
        if (this.rsvps.fields.pax_planned == 0 || typeof this.rsvps.fields.pax_planned === "undefined") {
            this.rsvps.fields.pax_planned = 1;
        }

        this.api.post(`guestlists/contacts`, this.rsvps)
            .then(() => {
                this.alert.success('Rsvps Create', 'Your Rsvps have been successfully created');
                if (this.store) {
                    this.store.dispatch('getData');
                }
                this.close();
            }, err => this.alert.handle(err))
    }

    close() {
        const params = _.cloneDeep(this.params);
        params.store = this.store;
        this.state.go(this.back, params);
    }
}

angular
    .module('airlst.guestlists')
    .controller('RsvpCreateCtrl', [
        'Alert',
        'Contacts',
        '$http',
        'NavService',
        'Rsvps',
        '$state',
        '$stateParams',
        'Deposit',
        '$rootScope',
        RsvpCreateCtrl
    ]);


