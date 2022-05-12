import template from './views/dashboard.tpl.html';

angular
    .module('airlst.dashboard')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.dashboard', {
            url: '/dashboard',
            templateUrl: template,
            controller: 'DashboardCtrl',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Dashboard'
            }
        });
}
