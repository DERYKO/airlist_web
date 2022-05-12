class GuestlistActionService {
    constructor($http) {
        this.api = $http;
    }

    getAvailableFieldsForGuestlist(guestlistId) {
        return this.api.get(`guestlists/${guestlistId}/available-fields`).then((response) => {
            return response.data.data;
        }, (e) => {
            return e;
        })
    }

    getDefaultAvailableFieldsForGuestlist() {
        return this.api.get(`guestlists/defaults/available-fields`).then((response) => {
            return response.data.data;
        }, (e) => {
            return e;
        })
    }
}


angular
    .module('airlst.guestlists')
    .service('GuestlistActionService', ['$http', ($http) => new GuestlistActionService($http)]);
