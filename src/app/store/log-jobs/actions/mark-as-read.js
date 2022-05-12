/**
 * @ngdoc service
 * @name checkins.factory:markAsRead
 *
 * @description
 *
 */
angular
    .module('airlst.logJobs')
    .factory('markAsRead', [
        '$auth',
        'Error',
        '$rootScope',
        markAsRead
    ]);

function markAsRead($auth, Error, $rootScope) {
    return {

        action: function (logJob, scope, manager) {
            logJob.read = true;
            logJob.save().then(function () {
                $auth.getUser().then(function (response) {
                    $rootScope.notification_count = response.notification_count;
                });
                manager.refresh();
            }, function (response) {
                Error.checkError(response);
            });
        }
    }
}