import editorTemplate from '../../views/rsvps-multiple-editor.html';

/**
 * @ngdoc object
 * @name rsvps.controller:RsvpsMasterListCtrl
 *
 * @description
 *
 */

class RsvpsMasterListCtrl {
    constructor(Rsvps, Contact, $http, Alert, Deposit) {
        this.contactObj = Contact;
        this.api = $http;
        this.alert = Alert;
        this.store = Rsvps.create('GuestlistMasterlistView');
        this.depositService = Deposit;
        this.store.commit('setTitle', 'Master Guestlist');
        this.store.commit('setVm', this);
        if (this.store.state.visible.length <= 3) {
            this.store.commit('setVisible', [
                'contact.full_name',
                'status',
                'pax_planned',
                'pax_guest',
                'code',
                'contact.sex',
                'contact.first_name',
                'contact.last_name',
                'contact.email',
                'last_message_state',
                'created_at',
                'updated_at',
                'guestlist.name'
            ]);
        }

        this.deposits = {
            countries: {},
            languages: {},
            genders: {},
            states: {}
        };
        this.store.dispatch('loadWorkflows', 'rsvps::masterlist');
        this._loadDeposits();
        this.mode = 'listview'
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

    showMultipleEditor() {
        this.mode = 'editor';
        this.editorTemplate = editorTemplate;
        this.parentSelector = {
            store: _.cloneDeep(this.store).reset({
                persist: false
            }),
            displayField: 'contact.full_name'
        };
        this.rsvp = {};
        this.contact = {};
        this.contactObj.getSchema().then(schema => {
            this.schema = schema;
        });

        this.customFields = [];
    }

    close() {
        this.mode = 'listview';
    }

    save() {
        const data = {
            fields: {rsvp: this.rsvp, contact: this.contact},
            items: this.store.getters.selectedFilters
        };
        this.api.put(`rsvps`, data)
            .then(() => {
                this.alert.success('Bookings Update', 'The bookings details have successfully been updated');
                this.store.dispatch('getData');
                this.mode = 'listview';
            }, err => this.alert.handle(err));

    }
}

angular
    .module('airlst.guestlists')
    .controller('RsvpsMasterListCtrl', [
        'Rsvps',
        'Contact',
        '$http',
        'Alert',
        'Deposit',
        RsvpsMasterListCtrl
    ]);
