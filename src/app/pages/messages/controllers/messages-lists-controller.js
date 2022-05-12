/**
 * @ngdoc object
 * @name messages.controller:MessagesCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.messages')
    .controller('MessagesCtrl', [
        'Alert',
        'Contact',
        'Error',
        'locale',
        'Message',
        'Messages',
        'ResourceCommon',
        'SelectBox',
        '$state',
        MessagesCtrl
    ]);

function MessagesCtrl(Alert, Contact, Error, locale, Message, Messages, ResourceCommon, SelectBox, $state) {

    var vm = this;

    init();

    function init() {
        vm.store = Messages;
        vm.name = 'MessageView';
        vm.model = Message;
        vm.show = showMessage;
        vm.addNew = addNew;
        vm.store.commit('setVm', vm);
        vm.store.dispatch('loadWorkflows', 'messages::list');
    }


    function showMessage(payload) {
        $state.go('app.messages.details', {
            id: payload.row.id,
            manager: vm.manager
        });
    }

    function addNew() {
        addEmail();
        //addSms();
    }

    function addEmail() {

    }

    function addSms() {
        SelectBox.multiple(Contact, {
            settings: {
                addNew: false,
                external: true
            }
        }).then(function (response) {
            var contacts = response.keys;
            contacts['type'] = 'Contact';
            ResourceCommon.sendSms(contacts).then(function (response) {
                vm.dispatch('getData');
                Alert.info(locale.getString('sweetalerts.sms_report'), response.message);
            }, function (response) {
                if (response !== 'cancel')
                    Error.default(response);
            });

        });
    }
}
