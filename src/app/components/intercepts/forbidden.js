angular
  .module('airlst.components')
  .config([
    '$httpProvider',
    interceptor
  ]);


function interceptor($httpProvider) {
  $httpProvider.interceptors.push([
    'Alert',
    '$injector',
    '$location',
    '$q',
    (Alert, $injector, $location, $q) => {
      return {
        'responseError': function (rejection) {
          if (rejection.status === 403) {
            const $state = $injector.get('$state');
            const previous = $state.previous();
            return Alert.confirm({
              type: 'error',
              title: 'Forbidden Action',
              message: rejection.data.message,
              hideCancel: !previous,
              confirmBtn: 'Dashboard',
              cancelBtn: 'Previous Page'
            }).then(() => {
                $state.back() || $state.go('app.dashboard');
                return $q.reject(rejection);
            }, () => {
                return $q.reject(rejection);
            });
          }
          return $q.reject(rejection);
        }
      };
    }
  ]);

}