angular
    .module('airlst.templates')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.templates', {
            abstract: true,
            url: '/templates',
            template: '<ui-view/>'
        });
}