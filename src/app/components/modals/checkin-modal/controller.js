export default class CheckInModalController {
    constructor($uibModalInstance, rsvp) {
        this.modal = $uibModalInstance;
        this.rsvp = rsvp;

        this.pax = 0;

        if (this.rsvp.pax_actual === this.rsvp.pax_planned) {
            this.pax = 0;
        } else {
            this.pax = _.clone(this.rsvp.pax_planned);
        }
    }

    checkIn(form) {
        if (form.$valid) {
            this.modal.close(this.pax);
        }
    };

    cancel() {
        this.modal.dismiss();
    }
}

CheckInModalController.$inject = [
    '$uibModalInstance',
    'rsvp'
];
