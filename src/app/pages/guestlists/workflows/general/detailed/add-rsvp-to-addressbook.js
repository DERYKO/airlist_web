/**
 * @ngdoc service
 * @name checkins.factory:genderizeRsvps
 * @description
 *
 */
// import

class addRsvpToAddressbook {
    constructor(Alert, $http, SweetAlert) {
        this.key = 'add-rsvp-to-addressbook';
        this.level = 'highlight';
        this.icon = 'address-book';
        this.title = 'Add to address book';
        this.alert = Alert;
        this.api = $http;
        this.sweetAlert = SweetAlert;
        this.accessor = (rsvp) => {
            return !rsvp.contact.data.addressbook;
        };
    }

    action(rsvp) {
        this.alert.confirm({
            title: `Add ${ rsvp.contact.data.full_name } to address book`,
            message: `Please confirm addition of the contact ${ rsvp.contact.data.full_name } to address book`,
            confirmBtn: 'Add To Address Book',
            confirmBtnColor: '#73ccb9'
        }).then(() => {
            return this.api.put(`contacts/${ rsvp.contact.data.id }`, {addressbook: true}).then(response => {
                rsvp.contact = response.data;
                this.sweetAlert.success('Success', 'The contact was successfully added to the addressbook');
            }, err => this.alert.handle(err));
        }, err => this.alert.handle(err));
    }
}

angular
    .module('airlst.guestlists')
    .factory('addRsvpToAddressbook', [
        'Alert',
        '$http',
        'SweetAlert',
        (Alert, $http, SweetAlert) => new addRsvpToAddressbook(Alert, $http, SweetAlert)
    ]);
