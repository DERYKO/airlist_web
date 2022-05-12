import ResetController from './controllers/reset-controller';

angular
    .module('airlst.auth')
    .config([
        'localeProvider',
        '$stateProvider',
        config
    ]);

import baseTemplate from './views/auth.tpl.html';
import loginTemplate from './views/login.tpl.html';
import forgotTemplate from './views/forgot.tpl.html';
import resetTemplate from './views/reset.tpl.html';
import activateAccountTemplate from './views/activate.tpl.html';

function config(localeProvider, $stateProvider) {
    $stateProvider
        .state('auth', {
            templateUrl: baseTemplate,
            data: {
                bodyClass: ''
            },
            controller: 'AuthBaseCtrl',
            controllerAs: 'base',
            resolve: {
                skipIfLoggedIn: [
                    '$q',
                    '$auth',
                    '$state',
                    skipIfLoggedIn
                ]
            }
        })
        .state('auth.login', {
            url: '/auth/login',
            templateUrl: loginTemplate,
            controller: 'AuthCtrl',
            controllerAs: 'auth',
            data: {
                pageTitle: localeProvider.$get().getString('auth.login')
            }
        })
        .state('auth.activate', {
            url: '/auth/activate/{uid}',
            controller: 'ActivationCtrl',
            templateUrl: activateAccountTemplate,
            controllerAs: 'vm',
            data: {
                pageTitle: localeProvider.$get().getString('auth.activate_account')
            }
        })
        .state('auth.forgot', {
            url: '/auth/forgot',
            templateUrl: forgotTemplate,
            controller: 'AuthCtrl',
            controllerAs: 'auth',
            data: {
                pageTitle: localeProvider.$get().getString('auth.forgot_password')
            }
        })
        .state('auth.reset', {
            url: '/auth/reset/{code}',
            templateUrl: resetTemplate,
            controller: ResetController,
            controllerAs: 'vm',
            data: {
                pageTitle: localeProvider.$get().getString('auth.reset_password')
            }
        })
        .state('app.logout', {
            url: '/auth/logout',
            controller: 'LogoutCtrl',
            controllerAs: 'logout'
        });

    function skipIfLoggedIn($q, $auth, $state) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            // deferred.reject();
            $state.go('app.dashboard');
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }
}
