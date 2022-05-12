/**
 * @ngdoc service
 * @name checkins.factory:addRsvpsToPicklists
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('removeRsvpsFromPicklists', [
        'locale',
        'Alert',
        'SweetAlert',
        'SelectBox',
        'Picklists',
        '$http',
        removeRsvpsFromPicklists
    ]);

function removeRsvpsFromPicklists(locale, Alert, SweetAlert, SelectBox, Picklists, $http) {
    return {
        key: 'remove-rsvps-from-picklists',
        title: 'Remove from Picklist(s)',
        level: 'selected',
        action: addToPicklist
    };

    function addToPicklist(action, store) {
        return locale.ready(['picklists', 'sweetalerts'])
            .then(() => {
                SelectBox.multiple(Picklists, {
                    displayField: 'name_with_count'
                }).then(response => {
                    $http.delete('picklists/rsvps', {
                        data: {
                            picklists: {
                                count: response.data.length,
                                filters: [
                                    {
                                        field: 'id',
                                        operator: 'IN',
                                        value: response.data
                                    }
                                ]
                            },
                            rsvps: store.getters.selectedFilters
                        }
                    }).then(() => {
                        store.dispatch('getData');
                        Alert.success(locale.getString('sweetalerts.remove_successful'), locale.getString('picklists.rsvps_successfully_removed'));
                    }, err => Alert.handle(err))
                }, err => Alert.handle(err));
            });
    }

}

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
        console.log(store, action);
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
