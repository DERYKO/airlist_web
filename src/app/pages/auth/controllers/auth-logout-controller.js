/**
 * @ngdoc object
 * @name auth.controller:AuthCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.auth')
    .controller('LogoutCtrl', [
        '$auth',
        'locale',
        '$state',
        'SweetAlert',
        'Users',
        LogoutCtrl
    ]);

function LogoutCtrl($auth, locale, $state, SweetAlert, Users) {

    locale.ready('auth').then(function () {
        logout();
    });

    function logout() {
        $auth.logout().then(function () {
            Users.dispatch('logout');
            SweetAlert.swal(locale.getString('auth.logout_successful'), locale.getString('auth.logout_successful_message'), 'success');
            $state.go('auth.login');
        });
    }
}
