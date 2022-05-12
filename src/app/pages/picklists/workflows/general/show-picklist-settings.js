/**
 * @ngdoc service
 * @name checkins.factory:showPicklistSettings
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('showPicklistSettings', [
        '$state',
        showPicklistSettings
    ]);

function showPicklistSettings($state, $stateParams) {
    const params = _.cloneDeep($stateParams);
    return {
        key: 'show-picklist-settings',
        title: 'Edit Settings',
        icon: 'pencil',
        level: 'highlight',
        order: 10,
        action({}, store) {
            $state.go('app.picklists.contacts.edit-settings', {
                pid: store.state.vm.picklist.id,
                picklist: store.state.vm.picklist,
                store: store,
                backParams: params
            })
        }
    }
}
