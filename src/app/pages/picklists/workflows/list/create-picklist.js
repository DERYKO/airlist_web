/**
 * @ngdoc service
 * @name checkins.factory:createPicklist
 *
 * @description
 *
 */
angular
    .module('airlst.picklists')
    .factory('createPicklist', [
        '$state',
        createPicklist
    ]);

function createPicklist($state) {
    return {
        key: 'create-picklist',
        title: 'Add new',
        level: 'highlight',
        icon: 'plus-circle',
        action: function ({row}, store) {
            $state.go('app.picklists.create', {store:store});
        }
    }
}
