import ngLoadingBar from 'angular-loading-bar';

/* @ngdoc object
 * @name themeBase
 * @description
 *
 */
angular
    .module('airlst.theme.base', [
        ngLoadingBar
    ])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    .run([
        '$rootScope',
        '$state',
        function ($rootScope, $state) {
            $rootScope.$state = $state;
        }]);

require('./controllers/error-controller');
require('./controllers/locale-controller');