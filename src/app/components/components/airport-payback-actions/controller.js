import editInformationModalTemplate from './views/edit-information-modal.tpl.html';
import cancelBookingModalTemplate from './views/cancel-booking-modal.tpl.html';

class AirportPaybackActionsController {
    constructor($http, $q, SweetAlert, $uibModal, Rollbar) {
        this.api = $http;
        this.queue = $q;
        this.sweetAlert = SweetAlert;
        this.modal = $uibModal;
        this.rollbar = Rollbar;

        this.rsvp = null;
        this.hideActions = false;
    }

    cancelBooking() {
        this.hideActions = true;

        this.modal.open({
            templateUrl: cancelBookingModalTemplate,
            controller: 'CancelBookingModalController',
            controllerAs: 'vm',
            resolve: {
                rsvpId: () => {
                    return this.rsvp.id;
                }
            }
        }).result.then((status) => {
            this.updateData();
            if(status) {
                this.sweetAlert.success('Cancelled', 'Cancelling request successful.');
            } else {
                this.sweetAlert.error('Error', 'Something failed while cancelling the rsvp.');
            }
        }, () => {
            this.updateData();
        });
    }

    confirmBooking() {
        this.hideActions = true;

        this.api.post(`rsvps/${this.rsvp.id}/airport/confirm`, {
            status: 'cancelled'
        }).then((response) => {
            this.updateData();
            this.sweetAlert.success('Confirmed', 'Confirming the request was successful and the guest vouchers have been created.');
        }, (response) => {
            this.sweetAlert.error('Error', 'Something failed while confirming the request.');
            this.updateData();
        });
    }

    editInformation() {
        this.modal.open({
            templateUrl: editInformationModalTemplate,
            controller: 'EditInformationModalController',
            controllerAs: 'vm',
            resolve: {
                rsvpId: () => {
                    return this.rsvp.id;
                }
            }
        }).result.then(() => {
            this.updateData();
        }, () => {
            this.updateData();
        });
    }

    updateData() {
        console.log(this.store);
        if (this.store) {
            this.store.dispatch('getData');
        }
        if (this.updateAction) {
            this.updateAction();
        }
    }
}

AirportPaybackActionsController.$inject = [
    '$http',
    '$q',
    'SweetAlert',
    '$uibModal',
    'Rollbar'
];

/**
 * @ngdoc controller
 * @name components.components:AirportPaybackActionsController
 * @restrict EA
 * @element
 *
 * @description
 *
 */
angular
    .module('airlst.components')
    .controller('AirportPaybackActionsController', AirportPaybackActionsController);
