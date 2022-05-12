import editorTemplate from '../../views/rsvps-multiple-editor.html'
import '../../views/guestlist-stats.tpl.html';

class RsvpsListCtrl {
    constructor(Alert, $http, Rsvps, NavService, $scope, $stateParams, Contact, Deposit) {
        this.api = $http;
        this.alert = Alert;
        this.contactObj = Contact;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.depositService = Deposit;
        this.rsvpsBaseStore = Rsvps;
        this.updateGuestlistData().then(response => {
            this.setupStore();
            this.setupBreadcrumbs(NavService);
            this.mode = 'listview';
        });

        this.deposits = {
            countries: {},
            languages: {},
            genders: {},
            states: {}
        };

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

    updateGuestlistData() {
        return new Promise((resolve, reject) => {
            this.api.get(`guestlists/${this.stateParams.gid}`).then((response) => {
                this.guestlist = response.data.data;
                resolve(response);
            }, (e) => {
                reject(e);
            })
        });
    }

    setupBreadcrumbs(NavService) {
        this.scope.$watch(() => {
            return this.guestlist;
        }, () => {
            NavService.setBreadcrumbParameters({
                guestlist_name: this.guestlist.name
            });
        });

        NavService.setBreadcrumbParameters({
            guestlist_name: this.guestlist.name
        });
    }

    setupStore() {
        if (this.stateParams.store) {
            this.store = this.stateParams.store;
        } else {
            this.store = this.rsvpsBaseStore.create('GuestlistView' + this.guestlist.id);
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
                    'updated_at'
                ]);
            }
        }

        this.store.commit('setTitle', this.guestlist.name);
        this.store.commit('setPermanentFilters', {'guestlist_id': this.guestlist.id});
        if (!this.guestlist.archived) {
            this.store.dispatch('loadWorkflows', 'rsvps::list');
        }
        this.store.commit('setVm', this);
        this.store.commit('setPrefix', 'guestlists/' + this.guestlist.id);
        this.store.resetGetters();

        this.scope.$watch(() => {
            return this.store.state.data;
        }, () => {
            this.updateGuestlistData();
        });

    }

    showMultipleEditor() {
        this.mode = 'editor';
        this.editorTemplate = editorTemplate;
        this.parentSelector = {
            store: _.cloneDeep(this.store).reset({
                persist: false,
                permanentFilters: {'guestlist.id': this.guestlist.id}
            }),
            displayField: 'contact.full_name'
        };
        this.rsvp = {};
        this.contact = {};
        this.contactObj.getSchema().then(schema => {
            this.schema = schema;
        });

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

    close() {
        this.mode = 'listview';
        this.scope.$applyAsync();
        if(this.store) {
            this.store.dispatch('getData');
        }
    }

    save() {
        const data = {
            fields: {rsvp: this.rsvp, contact: this.contact},
            items: this.store.getters.selectedFilters
        };
        this.api.put(`rsvps`, data)
            .then(() => {
                this.alert.success('Bookings Update', 'The bookings details have successfully been updated');
                this.mode = 'listview';
                this.scope.$applyAsync();
                if(this.store) {
                    this.store.dispatch('getData');
                }
            }, err => this.alert.handle(err));

    }

    refresh() {
        return this.api.get(`guestlists/${this.guestlist.id}`)
            .then(response => {
                this.guestlist = response.data.data;
                this.setupStore();
                // return this.store.dispatch('getData');
            }, err => {
                this.alert.handle(err);
            });
    }
}


RsvpsListCtrl.$inject = ['Alert', '$http', 'Rsvps', 'NavService', '$scope', '$stateParams', 'Contact', 'Deposit'];


angular
    .module('airlst.guestlists')
    .controller('RsvpsListCtrl', RsvpsListCtrl);
