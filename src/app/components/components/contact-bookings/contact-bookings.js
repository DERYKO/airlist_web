import template from './contact-bookings.tpl.html';
import singleEmailTemplate from '../../../pages/guestlists/views/workflows/send-single-email.tpl.html';
import {singleEmailCtrl} from '../../../pages/guestlists/workflows/general/detailed/controllers/single-email-controller';

class ContactBookingsController {
    constructor(Rsvps, $scope, $state, Acl, Alert, $http, $uibModal) {
        this.state = $state;
        this.scope = $scope;
        this.acl = Acl;
        this.alert = Alert;
        this.api = $http;
        this.modal = $uibModal;
        this.data = [];
        this.rsvpsFastPipe = Rsvps.create({
            persists: false,
            listView: 'UpcomingBookings'
        });
        this._configureFastPipe();
        this.scope.$watch(() => {
            return this.contact;
        }, () => {
            if (this.contact) {
                this._updateFastPipeData();
            }
        });
    }

    _configureFastPipe() {
        const columns = [
            {
                key: 'contact.id',
                type: 'integer',
                visible: true
            },
            {
                key: 'guestlist.id',
                type: 'integer',
                visible: true
            },
            {
                key: 'guestlist.name',
                type: 'string',
                visible: true
            },
            {
                key: 'code',
                type: 'string',
                visible: true
            },
            {
                key: 'guestlist.date',
                type: 'datetime',
                visible: false
            },
            {
                key: 'status',
                type: 'string',
                visible: true
            },
            {
                key: 'pax_planned',
                type: 'integer',
                visible: true
            },
            {
                key: 'pax_actual',
                type: 'integer',
                visible: true
            }
        ];

        this.rsvpsFastPipe.commit('setColumns', columns);
    }

    _updateFastPipeData() {
        this._configureFastPipe();
        this.rsvpsFastPipe.commit('setSort', {'guestlist.date': 'asc'});
        this.rsvpsFastPipe.commit('setPermanentFilters', {'contact.id': this.contact.id});
        this.rsvpsFastPipe.dispatch('getData').then(() => {
            this.items = this.rsvpsFastPipe.state.data;
        });
    }

    openRsvpDetails(rsvp) {
        this.state.go('app.guestlists.rsvps.details', {gid: rsvp.guestlist.id, id: rsvp.id});
    }

    editRsvp(rsvp) {
        this.state.go('app.guestlists.rsvps.edit', {gid: rsvp.guestlist.id, id: rsvp.id});
    }

    deleteRsvp(rsvp) {
        this.alert.confirm({
            title: 'Confirm Deletion',
            message: `Please confirm you want to move this rsvp to trash?`,
            type: 'warning',
            confirmBtn: 'Delete',
            wait: true,
        })
            .then(() => {
                this.api.delete(`rsvps/${rsvp.id}`)
                    .then(() => {
                        if (this.store) {
                            this.store.dispatch('getData');
                        }
                        return this.alert.success(`Successfully moved rsvp to trash`);
                    }, err => this.alert.handle(err));
            }, err => this.alert.handle(err));
    }

    sendEmail(rsvp) {
        this.modal.open({
            templateUrl: singleEmailTemplate,
            controller: ['Alert', '$http', 'rsvp', '$scope', 'Templates', '$uibModalInstance', '$sce', singleEmailCtrl],
            controllerAs: 'vm',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                rsvp: () => {
                    return this.api.get(`rsvps/${rsvp.id}?include=contact`).then((response) => {
                        return response.data.data;
                    }, (err) => {
                        this.alert.handle(err);
                    })
                }
            }
        }).result.then(null, err => this.alert.handle(err));
    }
}

angular
    .module('airlst.components')
    .component('contactBookings', {
        bindings: {
            contact: '<',
            store: '<'
        },
        controller: ['Rsvps', '$scope', '$state', 'Acl', 'Alert', '$http', '$uibModal', ContactBookingsController],
        controllerAs: 'vm',
        templateUrl: template
    });
