import mainTemplate from './views/main.tpl.html';
import connectionInfoTemplate from './views/connection-info.tpl.html';

angular
    .module('airlst.billing.stripe')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing.stripe', {
            abstract: true,
            url: 'stripe',
            templateUrl: mainTemplate,
            data: {
                pageTitle: 'Position'
            }
        })
        .state('app.billing.stripe.connection-info', {
            url: '',
            sticky: true,
            data: {
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: connectionInfoTemplate,
                    controller: 'ConnectionInfoCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}