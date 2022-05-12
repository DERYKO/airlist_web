import CompanyModules from '../factories/modules-service';

/**
 * @ngdoc object
 * @name users.controller:UsersCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.users')
    .controller('UsersCreateCtrl', [
        'Error',
        'locale',
        '$state',
        'SweetAlert',
        'ResourceCommon',
        '$rootScope',
        'User',
        '$q',
        UsersCreateCtrl
    ]);

function UsersCreateCtrl(Error, locale, $state, SweetAlert, ResourceCommon, $rootScope, User, $q) {
    const vm = this;

    vm.user = {
        editable: true
    };

    vm.model = User;
    vm.save = createUser;
    vm.roles = $rootScope.company.roles;
    vm.modules = CompanyModules.getModules($rootScope.company.modules);

    vm.cancelEditing = function () {
        $state.go('app.users.index');
    };

    init();

    function init() {

    }

    function createUser(fields) {
        User.post(fields).then(function (model) {
            SweetAlert.swal(locale.getString('users.user_saved'), locale.getString('users.user_saved_message'), 'success');
            $state.go('app.users.index', {}, {reload: true});
        }, function (response) {
            Error.checkError(response);
        });
    }
}
