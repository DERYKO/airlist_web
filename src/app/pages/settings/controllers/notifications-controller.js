/**
 * @ngdoc object
 * @name settings.controller:SettingsCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.settings')
    .controller('NotificationsCtrl', [
        'locale',
        'ResourceCommon',
        'Users',
        '$rootScope',
        'Setting',
        'Templates',
        'SweetAlert',
        'Acl',
        'AceEditor',
        NotificationsCtrl
    ]);

function NotificationsCtrl(locale, ResourceCommon, Users, $rootScope, Setting, Templates, SweetAlert, Acl, AceEditor) {
    const vm = this;

    vm.update = update;

    init();

    function init() {
    updateCompanyData();
        vm.form = {
            templates: {
                store: Templates.reset({
                    listview: 'TemplatesSelectorStore',
                    persist: false
                }),
                settings: {}
            },
            sms: {}
        };

        AceEditor.getEditor((editor) => vm.form.sms = editor);

        vm.canSendEmail = Acl.hasRight('messages::send-email');
        vm.canSendSms = Acl.hasRight('messages::send-sms');

    }

    function update() {
        Setting.updateCompany(vm.company).then(function (response) {
            SweetAlert.swal('Success', 'Settings saved successful', 'success');
        }, function () {
            SweetAlert.swal('Failed', 'An error occurred while saving settings. Please retry', 'error');
        });
    }

    function updateCompanyData() {
        Users.dispatch('getLoggedIn').then(() => {
            vm.company = Users.state.company;
        });
    }
}
