class CancelBookingModalController {
    constructor($uibModalInstance, rsvpId, $http) {
        this.modalInstance = $uibModalInstance;
        this.loading = false;
        this.error = false;
        this.errorMessage = '';

        this.rsvpId = rsvpId;
        this.api = $http;
    }

    save() {
        this.loading = true;
        this.api.post(`rsvps/${this.rsvpId}/airport/cancel`, {
            status: 'cancelled',
            reason: this.reason
        }).then((response) => {
            this.loading = false;
            this.close(true);
        }, (response) => {
            this.loading = false;
            this.close(false);
        });
    }

    close(dataToReturn) {
        this.modalInstance.close(dataToReturn);
    }

    dismiss() {
        this.modalInstance.dismiss();
    }

}

CancelBookingModalController.$inject = [
    '$uibModalInstance',
    'rsvpId',
    '$http'
];

angular.module('airlst.components')
    .controller('CancelBookingModalController', CancelBookingModalController);