class EditInformationModalController {
    constructor($uibModalInstance, rsvpId, $http, SweetAlert, $q) {
        this.modalInstance = $uibModalInstance;
        this.loading = true;
        this.error = false;
        this.errorMessage = '';

        this.rsvpId = rsvpId;
        this.rsvp = null;
        this.contact = null;
        this.api = $http;
        this.sweetAlert = SweetAlert;
        this.queue = $q;

        this.loadRsvpData();
    }

    loadRsvpData() {
        this.error = false;
        this.errorMessage = '';
        this.api.get(`rsvps/${this.rsvpId}`).then((response) => {
            this.rsvp = response.data.data;
            this.api.get(`contacts/${this.rsvp.contact_id}`).then((response) => {
                this.loading = false;
                this.contact = response.data.data;
            }, () => {
                this.loading = false;
                this.errorMessage = 'Error while loading contact';
                this.error = true;
            });
        }, () => {
            this.loading = false;
            this.errorMessage = 'Error while loading rsvp';
            this.error = true;
        });
    }

    save() {
        this.queue.all([this.api.put(`guestlists/${this.rsvp.guestlist_id}/rsvps/${this.rsvp.id}`, {
            pax_planned: this.rsvp.pax_planned,
            custom_2: this.rsvp.custom_2,
            custom_3: this.rsvp.custom_3
        }), this.api.put(`contacts/${this.contact.id}`, {
            email: this.contact.email
        })]).then(() => {
            this.sweetAlert.success('Success', 'Changes has been saved successful');
            this.close();
        }, () => {
            this.sweetAlert.success('Error', 'Error while saving data, please retry');
        });
    }

    close() {
        this.modalInstance.close();
    }

    dismiss() {
        this.modalInstance.dismiss();
    }

}

EditInformationModalController.$inject = [
    '$uibModalInstance',
    'rsvpId',
    '$http',
    'SweetAlert',
    '$q'
];

angular.module('airlst.components')
    .controller('EditInformationModalController', EditInformationModalController);