angular
    .module('airlst.components')
    .config([
        '$httpProvider',
        interceptor
    ]);

function interceptor($httpProvider) {
    $httpProvider.interceptors.push([
        'Env',
        '$injector',
        '$q',
        '$window',
        'SweetAlert',
        function (Env, $injector, $q, $window, SweetAlert) {
            return {
                request: function (request) {
                    if (Env.version) {
                        request.headers['X-Airlst-Version'] = Env.version;
                    }
                    return request;
                },
                responseError: function (rejection) {
                    if (rejection.status === 409 && rejection.data.code === 'version-conflict') {
                        SweetAlert.swal({
                                type: 'error',
                                title: 'Update Available: ' + Env.version,
                                text: 'You are running on an outdated version of AirLST in your browser, so we cannot proceed. Please reload this page to continue. If this warning persists, try clearing your browser cache. We generally recommend using Chrome as a browser.',
                                showCancelButton: true,
                                confirmButtonColor: '#ed5565',
                                confirmButtonText: 'Reload page now',
                                cancelButtonText: 'Refresh later',
                                showLoaderOnConfirm: true,
                                closeOnConfirm: false
                            }, function (refresh) {
                                if (refresh) {
                                    $window.location.reload();
                                }
                            }
                        );
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);
}
