/**
 * @ngdoc service
 * @name checkins.factory:viewBookings
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('createGuestlist', [
        '$state',
        createGuestlist
    ]);

function createGuestlist($state) {
    return {
        key: 'create-guestlist',
        title: 'Add New',
        level: 'highlight',
        icon: 'plus-circle',
        action: function (action, store) {
            return $state.go('app.guestlists.create', {store: store});
        }
    }
}
