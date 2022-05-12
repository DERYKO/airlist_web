class DashboardController {

    constructor(auth) {
        this.auth = auth;
        this.availableDashboards = [
            'heart_finance_dashboard',
            'airport_on_event_dashboard',
            'dekra_dashboard'
        ];
        this.dashboard = null;
        this.loading = true;
        this.initDashboard();
    }

    initDashboard() {
        this.auth.getUser().then((user) => {
            if(user.custom_dashboard) {
                if(this.availableDashboards.indexOf(user.custom_dashboard) > -1) {
                    this.dashboard = user.custom_dashboard;
                }
            }

            this.loading = false;
        });
    }
}

DashboardController.$inject = [
    '$auth'
];

/**
 * @ngdoc object
 * @name dashboard.controller:DashboardCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.dashboard')
    .controller('DashboardCtrl', DashboardController);
