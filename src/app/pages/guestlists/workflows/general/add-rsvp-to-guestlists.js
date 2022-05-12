/**
 * @ngdoc service
 * @name checkins.factory:addRsvpToGuestlists
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('addRsvpToGuestlists', [
        'Contact',
        'Guestlist',
        'Error',
        'locale',
        '$q',
        'SelectBox',
        'SweetAlert',
        addRsvpToGuestlists
    ]);

function addRsvpToGuestlists(Contact, Guestlist, Error, locale, $q, SelectBox, SweetAlert) {
    return {
        key: 'add-rsvp-to-guestlists',
        title: 'Make Booking',
        level: 'global',
        icon: 'plus-circle',
        class: 'color-blue',
        action: function (manager) {
            return SelectBox.multiple(Contact,
                {
                    listview: {
                        filterable: 'external',
                        pagination: 'external'
                    }
                }).then(function (contacts) {
                return Guestlist.addToGuestlist(contacts.keys, manager).then(function () {
                    manager.refresh();
                    SweetAlert.swal(locale.getString('sweetalerts.add_successful'), locale.getString('guestlists.contacts_added'), 'success');
                }, function (response) {
                    if (typeof response != 'string')
                        Error.checkError(response);

                    return $q.reject(response);
                });
            });
        }
    };
}