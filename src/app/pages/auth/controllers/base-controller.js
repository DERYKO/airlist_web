/**
 * @ngdoc object
 * @name auth.controller:ActivationCtrlCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.auth')
    .controller('AuthBaseCtrl', [
        '$state',
        BaseController
    ]);

function BaseController($state) {
    var vm = this;

    vm.state = $state;
}