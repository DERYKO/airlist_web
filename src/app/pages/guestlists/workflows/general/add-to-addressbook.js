/**
 * @ngdoc service
 * @name airlst.guestlists.factory:addToAddressbook
 * @description
 */

class addRsvpsToAddressbook {
    constructor(Alert, $http, SweetAlert) {
        this.key = 'add-to-addressbook';
        this.level = 'selected';
        this.icon = 'address-book';
        this.title = 'Add to address book';
        this.alert = Alert;
        this.api = $http;
        this.sweetAlert = SweetAlert;
        this.accessor = (rsvp) => {
            return !rsvp.contact.data.addressbook;
        };
    }

    action(action, store) {
        this.alert.confirm({
            title: `Add to address book?`,
            message: `Please confirm adding the contacts of ${store.getters.selectedCount} rsvps to address book`,
            confirmBtn: 'Add To Address Book',
            confirmBtnColor: '#73ccb9'
        }).then(() => {
            return this.api.put(`contacts`, {
                relationship: 'rsvp',
                items: store.getters.selectedFilters,
                fields: {
                    addressbook: true
                }
            }).then(response => {
                this.sweetAlert.success('Success', 'The contacts have successfully been added to the addressbook');
            }, err => this.alert.handle(err));
        }, err => this.alert.handle(err));
    }
}

angular
    .module('airlst.guestlists')
    .factory('addToAddressbook', [
        'Alert',
        '$http',
        'SweetAlert',
        (Alert, $http, SweetAlert) => new addRsvpsToAddressbook(Alert, $http, SweetAlert)
    ]);
