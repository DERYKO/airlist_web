import '../../views/guestlist-stats.tpl.html';

class RsvpsDuplicatesCtrl {
    constructor(Alert, $http, RsvpDuplicates, NavService, $scope, $stateParams, Contact, $uibModal) {
        this.api = $http;
        this.alert = Alert;
        this.contactObj = Contact;
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.updateGuestlistData().then(response => {
            this.setupStore(RsvpDuplicates);
            this.setupBreadcrumbs(NavService);
            this.mode = 'listview';
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

    setupStore(RsvpDuplicates) {
        if (this.stateParams.store) {
            this.store = this.stateParams.store;
        } else {
            this.store = RsvpDuplicates.create(`Guestlist${this.guestlist.id}DuplicatesView`);
            // if (this.store.state.visible.length <= 3) {
            //     this.store.commit('setVisible', [
            //         'contact.first_name',
            //         // 'contact.email'
            //     ]);
            // }
        }

        this.store.dispatch('loadState');
        this.store.commit('setTitle', 'Duplicates on: ' + this.guestlist.name);
        this.store.commit('setVm', this);
        this.store.commit('setPrefix', 'guestlists/' + this.guestlist.id);
        this.store.commit('setDataUrl', 'guestlists/' + this.guestlist.id + '/rsvps/duplicates');

        this.store.dispatch('getDefinitions');

        this.store.resetGetters();

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
                this.refresh().then(this.close.bind(this))
            }, err => this.alert.handle(err));

    }

    refresh() {
        return this.api.get(`guestlists/${this.guestlist.id}`)
            .then(response => {
                this.guestlist = response.data.data;
                return this.store.dispatch('getData');
            }, err => {
                this.alert.handle(err);
            });
    }
}


RsvpsDuplicatesCtrl.$inject = [
    'Alert',
    '$http',
    'RsvpDuplicates',
    'NavService',
    '$scope',
    '$stateParams',
    'Contact',
    '$uibModal'
];

angular
    .module('airlst.guestlists')
    .controller('RsvpsDuplicatesCtrl', RsvpsDuplicatesCtrl);
