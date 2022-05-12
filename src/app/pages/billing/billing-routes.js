angular
    .module('airlst.billing')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing', {
            abstract: true,
            url: '/billing/',
            template: '<ui-view/>',
            data: {
                pageTitle: 'Invoice Templates',
                showBackBtn: true
            }
        });
}