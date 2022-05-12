/**
 * @ngdoc service
 * @name checkins.factory:viewSeatmap
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('viewSeatmap', [
        '$state',
        viewSeatmap
    ]);

function viewSeatmap($state) {
    return {
        key: 'view-seatmap',
        title: 'View Seatmap',
        level: 'global',
        class: 'color-blue',
        icon: 'pe-7s-exapnd2',
        action: function (guestlist) {
            if (guestlist.vm) {
                guestlist = guestlist.vm.guestlist;
            }
            $state.go('app.guestlists.rsvps.seats', {gid: guestlist.id, guestlist: guestlist});
        }
    }
}
