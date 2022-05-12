/**
 * @ngdoc service
 * @name checkins.factory:markAsRead
 *
 * @description
 *
 */
angular
    .module('airlst.logJobs')
    .factory('readSelected', [
        '$auth',
        'Error',
        '$rootScope',
        'Restangular',
        readSelected
    ]);

function readSelected($auth, Error, $rootScope, Restangular) {
    return {
        key: 'read-selected',
        title: 'Mark as read',
        level: 'selected',
        action: function (keys, manager) {
            Restangular.one('jobs').doPUT({
                fields: {read: 1},
                keys: keys
            }).then(function () {
                manager.refresh();
                $auth.getUser().then(function (response) {
                    $rootScope.notification_count = response.notification_count;
                });
            }, function (response) {
                Error.checkError(response);
            });
        }
    }
}