/**
 * @ngdoc object
 * @name theme.base.controller:ErrorCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.theme.base')
    .controller('ThemeErrorController', [
        '$state',
        '$stateParams',
        ErrorCtrl
    ]);

function ErrorCtrl($state, $stateParams) {

    init();

    function init() {
        if (!$stateParams.skipRetry) {
            $state.go('app.dashboard')
        }
    }

}