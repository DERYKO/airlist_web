/**
 * @ngdoc service
 * @name checkins.factory:updateSelectedRsvps
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('updateRsvps', [
        '$state',
        updateRsvps
    ]);

function updateRsvps() {
    return {
        key: 'update-rsvps',
        title: 'Update Bookings',
        level: 'selected',
        action({}, store) {
            store.state.vm.showMultipleEditor();
        }
    };

}