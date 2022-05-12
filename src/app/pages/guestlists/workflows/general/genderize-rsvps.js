/**
 * @ngdoc service
 * @name checkins.factory:genderizeRsvps
 * @description
 *
 */
// import
import genderizeContacts from  '../../../contacts/libraries/genderize-contacts';

class genderizeRsvps extends genderizeContacts {
    constructor(Alert, $http, $uibModal) {
        super(Alert, $http, $uibModal);
        this.key = 'genderize-rsvps';
        this.title = 'Genderize Rsvps\' Contacts';
    }
}

angular
    .module('airlst.guestlists')
    .factory('genderizeRsvps', [
        'Alert',
        '$http',
        '$uibModal',
        (Alert, $http, $uibModal) => new genderizeRsvps(Alert, $http, $uibModal)
    ]);

export default genderizeRsvps;