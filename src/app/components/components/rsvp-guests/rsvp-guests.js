import template from './rsvp-guests.tpl.html';
import singleEmailTemplate from '../../../pages/guestlists/views/workflows/send-single-email.tpl.html';
import {singleEmailCtrl} from '../../../pages/guestlists/workflows/general/detailed/controllers/single-email-controller';

class RsvpGuestsCtrl {
    constructor(Alert, $http, $scope, $state, $stateParams, $uibModal, $rootScope, Acl, Rsvps) {
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
        this.modal = $uibModal;
        this.scope = $scope;
        this.params = _.cloneDeep($stateParams);
        this.acl = Acl;
        this.rsvpsStore = Rsvps.create('RsvpGuestBaseStore');
        this.currentStore = null;
        this.rsvp = null;
        this.currentGuests = [];

        this.loading = true;
        this._initWatchers();
        // this._loadGuests();
    }

    _initWatchers() {
        this.scope.$watch(() => {
            return this.rsvp;
        }, () => {
            if (this.rsvp) {
                this._loadGuests();
            }
        })
    }

    _loadGuests() {
        this.loading = true;
        this.currentGuests = [];
        this.currentStore = this.rsvpsStore.reset({
            persist: false,
            listview: 'Rsvp' + this.rsvp.id + 'Guests'
        });

        this.currentStore.commit('setSlug', 'rsvps/' + this.rsvp.id + '/child');

        this.currentStore.commit('setPermanentFilters', {
            'guestlist_id': this.rsvp.guestlist_id,
            'parent_rsvp_id': this.rsvp.id
        });
        this.currentStore.commit('setTitle', 'Guests of rsvp #' + this.rsvp.id);
        this.currentStore.commit('setPermanentFilters', {
            guestlist_id: this.rsvp.guestlist_id,
            'parent_rsvp.id': this.rsvp.id
        });
        this.currentStore.resetGetters();

        this.currentStore.commit('setVisible', [
            'contact.full_name',
            'contact.preferred_email',
            'contact.email',
            'contact.business_email',
            'status',
            'code'
        ]);
        this.currentStore.commit('setSort', {'contact.full_name': 'asc'});

        this.currentStore.dispatch('getDefinitions').then(() => {
            this.currentStore.dispatch('getData').then(() => {
                this.currentGuests = this.currentStore.state.data;
                this.loading = false;
            })
        });
    }

    openRsvpDetails(rsvp) {
        this.state.go('app.guestlists.rsvps.details', {
            gid: this.rsvp.guestlist.data.id,
            id: rsvp.id,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    goToGuestView(rsvp) {
        this.state.go('app.guestlists.rsvps.details.tab', {
            gid: this.rsvp.guestlist.data.id,
            id: rsvp.id,
            store: this.store,
            tab: 'guests'
        });
    }

    editRsvp(rsvp) {
        this.state.go('app.guestlists.rsvps.edit', {
            gid: this.rsvp.guestlist.data.id,
            id: rsvp.id,
            store: this.store,
            back: this.state.current.name,
            backParams: this.params
        });
    }

    deleteRsvp(rsvp) {
        this.alert.confirm({
            title: 'Confirm Deletion',
            message: `Please confirm you want to delete this guest?`,
            type: 'warning',
            confirmBtn: 'Delete',
            wait: true,
        })
            .then(() => {
                this.api.delete(`rsvps/${ rsvp.id}`, {
                    data: {
                        force: false
                    }
                }).then(() => {
                    this._loadGuests();
                    return this.alert.success(`Successfully moved rsvp to trash`);
                }, err => this.alert.handle(err));
            }, err => this.alert.handle(err));
    }


    sendEmail(rsvpToSend) {
        this.modal.open({
            templateUrl: singleEmailTemplate,
            controller: ['Alert', '$http', 'rsvp', '$scope', 'Templates', '$uibModalInstance', '$sce', singleEmailCtrl],
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                rsvp: () => {
                    return this.api.get(`rsvps/${rsvpToSend.id}?include=contact`).then((response) => {
                        return response.data.data;
                    }, (e) => {
                        this.alert.handle(e);
                    });
                }
            }
        }).result.then(null, err => this.alert.handle(err));
    }
}

RsvpGuestsCtrl.$inject = [
    'Alert',
    '$http',
    '$scope',
    '$state',
    '$stateParams',
    '$uibModal',
    '$rootScope',
    'Acl',
    'Rsvps'
];

angular
    .module('airlst.components')
    .component('rsvpGuests', {
        bindings: {
            rsvp: '<',
            store: '=',
            headline: '@',
            hideActions: '<',
            reloadAction: '&'
        },
        controller: RsvpGuestsCtrl,
        controllerAs: 'vm',
        templateUrl: template
    });
