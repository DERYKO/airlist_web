export default (store) => {
    const locale = store.ng.injector.get('locale'),
        growl = store.ng.injector.get('growl'),
        filter = store.ng.injector.get('$filter');

    store.state.pusher.bind('job-log-state-change', function (data) {
        locale.ready('notifications').then(function () {
            let funcToUse = null,
                titleText = '';
            switch (data.status) {
                case 'finished':
                    funcToUse = 'success';
                    titleText = locale.getString('notifications.states.success');
                    break;
                case 'failed':
                    funcToUse = 'error';
                    titleText = locale.getString('notifications.states.failed');
                    break;
                case 'running':
                    // funcToUse = 'info';
                    // titleText = locale.getString('notifications.states.running');
                    break;
            }

            let message = data.job_class.resolved;

            if (data.extended_message) {
                let filteredExtension = filter('nl2br')(data.extended_message);
                message += `<br /><small>${filteredExtension}</small>`;
            }

            if (funcToUse) {
                growl[funcToUse](message, {
                    title: titleText
                })
            }
        });
    });
};
