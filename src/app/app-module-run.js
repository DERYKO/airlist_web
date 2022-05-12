import MODULE_NAME from './app.js';
import './pages/users/store/users';

/**
 * @ngdoc object
 * @name airlst
 * @description
 *
 */
angular.module(MODULE_NAME)
    .run([
        'Acl',
        '$q',
        '$rootScope',
        '$http',
        '$auth',
        '$state',
        '$transitions',
        '$window',
        'Users',
        '$uibModal',
        '$anchorScroll',
        run
    ]);

function run(Acl, $q, $rootScope, $http, $auth, $state, $transitions, $window, Users, $uibModal,$anchorScroll) {

    const timers = {};

    $rootScope.$state = $state;
    $rootScope.collapsedBody = false;
    $rootScope.curDate = new Date();
    // angular.element(window).width() < 960;

    $http.defaults.headers.common['Authorization'] = function () {
        if ($auth.getToken()) {
            return 'Bearer ' + $auth.getToken();
        }
    };

    $http.defaults.headers.delete = {
        'Content-Type': 'application/json'
    };

    $transitions.onBefore({to: 'app.**'}, (trans) => {
        timers[trans.to().name] = Date.now();
        if (!$auth.isAuthenticated()) {
            return trans.router.stateService.target('auth.login');
        }

        $rootScope.editing = false;

        return $q.when($rootScope.user || Users.dispatch('getLoggedIn')
            .then(() => {
                $rootScope.user = Users.state.loggedin.profile;
                $rootScope.company = Users.state.company;
                Acl.setUser($rootScope.user);
                Acl.setCompany($rootScope.company);
                return $rootScope.user;
            }))
            .then(() => {
                if (trans.to().data.module && !Acl.hasModule(trans.to().data.module)) {
                    return trans.router.stateService.go('app.dashboard');
                }
                if (trans.to().data.rights && !Acl.hasRight(trans.to().data.rights)) {
                    Acl.accessDenied(trans.to().data.rights);
                    return trans.router.stateService.back();
                }
            })
    });

    $uibModal.backdrop = 'static';
    $anchorScroll.yOffset = 80;
}
