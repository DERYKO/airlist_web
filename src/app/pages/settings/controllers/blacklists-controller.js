/**
 * @ngdoc object
 * @name settings.controller:SettingsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.settings')
    .controller('BlacklistsCtrl', [
        'locale',
        'Users',
        'Setting',
        'SweetAlert',
        BlacklistsCtrl
    ]);

function BlacklistsCtrl(locale, Users, Setting, SweetAlert) {
    const vm = this;

    vm.update = update;

    init();

    function init() {
        updateCompanyData();
    }

    function update() {
        Setting.updateCompany(vm.company).then((response) => {
            SweetAlert.swal('Success', 'Settings saved successful', 'success');
        }, () => {
            SweetAlert.swal('Failed', 'An error occurred while saving settings. Please retry', 'error');
        });
    }

    function updateCompanyData() {
        Users.dispatch('getLoggedIn').then(() => {
            vm.company = Users.state.company;
        });
    }
}
