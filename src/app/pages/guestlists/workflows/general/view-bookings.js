/**
 * @ngdoc service
 * @name checkins.factory:viewBookings
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('viewBookings', [
        '$state',
        viewBookings
    ]);

function viewBookings($state) {
    return {
        key: 'view-bookings',
        title: 'Bookings',
        level: 'row',
        action: function ({row}) {
            return $state.go('app.guestlists.rsvps.index', {guestlist: row, gid: row.id});
        }
    }
}
