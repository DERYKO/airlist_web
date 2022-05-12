/**
 * @ngdoc service
 * @name checkins.factory:masterlist
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('masterlist', [
        '$state',
        masterlist
    ]);

function masterlist($state) {
    return {
        key: 'masterlist',
        title: 'Masterlist',
        level: 'highlight',
        icon: 'list',
        order: 20,
        action: function (store) {
            $state.go('app.guestlists.masterlist', {store: store});
        }
    }
}
