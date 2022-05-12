/**
 * @ngdoc service
 * @name checkins.factory:guestlistSettings
 *
 * @description
 *
 */
angular
    .module('airlst.guestlists')
    .factory('editGuestlistSettings', [
        '$state',
        '$stateParams',
        editGuestlistSettings
    ]);

function editGuestlistSettings($state, $stateParams) {
    const params = _.cloneDeep($stateParams);

    return {
        key: 'edit-guestlist-settings',
        title: 'Edit Settings',
        icon: 'pencil',
        level: 'highlight',
        order: 70,
        action: function ({}, store) {
            return $state.go('app.guestlists.rsvps.edit-settings', {
                guestlist: store.state.vm.guestlist,
                gid: store.state.vm.guestlist.id,
                store: store,
                backParams: params
            });
        }
    }
}
