angular
    .module('airlst.components')
    .config([
        '$httpProvider',
        interceptor
    ]);

function interceptor($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        '$location',
        '$q',
        function ($injector, $location, $q) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status == 401) {
                        var $auth = $injector.get('$auth');
                        var $http = $injector.get('$http');
                        var $state = $injector.get('$state');
                        var token = $auth.getToken();
                        if (token) {
                            return $auth.refreshToken(token).then(function () {
                                return $http(rejection.config);
                            }, function () {
                                $auth.removeToken();
                                $location.path('auth/login');
                            });
                        }
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);
}