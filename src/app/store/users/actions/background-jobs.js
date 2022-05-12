export default {
    key: 'background-jobs',
    handle(data) {
        if (!$rootScope.notification_count) {
            $rootScope.notification_count = 0;
        }

        if (user.id === data.user_id) {
            $rootScope.notification_count = data.job_count;
        }

        locale.ready('notifications').then(function () {
            if (!data.log.parent_id && data.status == 'success') {
                growl.success(data.message ? data.message : locale.getString('notifications.' + data.log.job_name + '_successful'));
            }
            if (!data.log.parent_id && data.status == 'failed') {
                growl.error(data.message ? data.message : locale.getString('notifications.' + data.log.job_name + '_failed'));
            }
        });

    }
}
