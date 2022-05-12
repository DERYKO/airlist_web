angular
    .module('airlst.documents')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.documents', {
            abstract: true,
            url: '/documents/',
            template: '<ui-view/>',
            data: {
                pageTitle: 'Documents'
            }
        });
}