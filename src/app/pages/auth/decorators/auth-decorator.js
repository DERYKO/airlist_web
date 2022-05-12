/**
 * @ngdoc decorator
 * @name auth.decorator:auth
 * @restrict EA
 * @element
 *
 * @description
 *
 */
angular
    .module('airlst.auth')
    .config([
        '$provide',
        decorator
    ]);

function decorator($provide) {
    $provide.decorator('$auth', [
        '$delegate',
        'Env',
        '$http',
        'SweetAlert',
        '$state',
        '$q',
        function ($delegate, Env, $http, SweetAlert, $state, $q) {
            var checkAuth = $delegate.isAuthenticated,
                logout = $delegate.logout,
                currentProfilePromise = null;

            $delegate.recoverPassword = function (email) {
                var opts = {};
                opts.url = Env.apiUrl + '/auth/recover';
                opts.data = {email: email};
                opts.method = 'POST';
                return $http(opts);
            };

            $delegate.refreshToken = function (token) {
                var opts = {};
                opts.url = Env.apiUrl + '/auth/token/refresh';
                opts.data = {token: token};
                opts.method = 'POST';
                return $http(opts).then(function (response) {
                    $delegate.setToken(response.data.token);
                    return $delegate.getToken();
                });
            };

            $delegate.isAuthenticated = function () {
                var token = $delegate.getToken();
                var isAuthenticated = checkAuth();
                if (!token)
                    return isAuthenticated;
                if (!isAuthenticated) {
                    return $delegate.refreshToken(token).then(function () {
                        isAuthenticated = checkAuth();
                        return isAuthenticated;
                    });
                }
                return isAuthenticated;
            };

            $delegate.resetPassword = function (data) {
                var opts = {};
                opts.url = Env.apiUrl + '/auth/reset';
                opts.data = data;
                opts.method = 'POST';
                return $http(opts);
            };

            $delegate.activate = function (id, code) {
                var opts = {};
                opts.url = Env.apiUrl + '/auth/activate/' + id + '/' + code;
                opts.method = 'GET';

                return $http(opts).then(function (response) {
                    $delegate.setToken(response.data.token);
                }, function (response) {
                    return response;
                });
            };

            $delegate.getUser = function (force) {
                if(force) {
                    currentProfilePromise = null;
                }
                if (!currentProfilePromise || force) {
                    currentProfilePromise = $http.get(Env.apiUrl + '/auth/profile', {
                        params: {
                            include: 'company'
                        }
                    }).then(function (response) {
                        $delegate.user = response.data.data;
                        return response.data.data;
                    })
                }

                return currentProfilePromise;
            };

            $delegate.updateUser = function () {
                var config = {
                    params: {
                        include: 'company'
                    }
                };
                $delegate.user = $http.get(Env.apiUrl + '/auth/profile', config).then(function (response) {
                    return response.data.data;
                });
                return $delegate.user;
            };

            $delegate.confirmPermission = function (permission) {
                return $delegate.getUser().then(function (user) {
                    if (user.permissions[permission]) {
                        return user;
                    }
                    SweetAlert.error('You are not permitted to perform this task');
                    $state.go('app.dashboard');
                    return $q.reject('Not permitted');
                }, function () {
                    SweetAlert.error('You must be logged in to perform this task');
                    $state.go('auth.login');
                    return $q.reject('Not loggedin');
                })
            };

            $delegate.logout = function () {
                return logout().then(function () {
                    localStorage.clear();
                    currentProfilePromise = null;
                    $delegate.user = undefined;
                });
            };

            return $delegate;
        }
    ]);
}
