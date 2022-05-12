import template from '../theme/airlst/views/main.html';
import errorTemplate from '../theme/airlst/views/error.html';

angular
    .module('airlst.pages')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        config
    ]);


function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            templateUrl: template,
            abstract: true,
            params: {
                sideView: false,
                back: undefined,
                backParams: undefined
            },
            data: {
                bodyClass: 'page-header-fixed'
            },
            resolve: {
                loginRequired: [
                    '$q',
                    '$location',
                    '$auth',
                    loginRequired
                ]
            }
        })
        .state('error', {
            url: '/oops',
            params: {skipRetry: false},
            data: {
                pageTitle: 'Oops. An error has occurred'
            },
            templateUrl: errorTemplate,
        });

    $urlRouterProvider.otherwise('/dashboard');

    function loginRequired($q, $location, $auth) {
        return $q.when($auth.isAuthenticated()).then(function (result) {
            if (result) {
                return true;
            }
            $location.path('auth/login');
        }, function () {
            $location.path('auth/login');
        })
    }
}