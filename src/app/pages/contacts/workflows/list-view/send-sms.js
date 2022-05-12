/**
 * @ngdoc service
 * @name checkins.factory:sendSms
 *
 * @description
 *
 */

import templateUrl from '../../views/workflows/sms-modal.tpl.html';

class SmsModalCtrl {

    constructor(ResourceCommon, $uibModalInstance, Users, $scope, AceEditor) {
        console.log(Users.state.loggedin.profile.company.data);
        this.sender_names = _.get(Users.state.loggedin.profile.company.data, 'settings.messages.sms_sender_names', []);
        this.message = {
            type: 'sms',
            content: '',
            sender: _.first(this.sender_names, {}).value
        };

        this.messageValidation = {
            isGsm: true,
            limit: 140,
            length: 0,
            smsCount: 0
        };

        $scope.$watch(() => this.message.content, () => {
            let gsm = "@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞ^{}\[~]|€ÆæßÉ!\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà\n ",
                gsmDoubleBytes = '€~{}[]^|\\',
                gsmCheck = true,
                strLengthPerChar = 0,
                strLengthGsm = 0;

            for (let i = 0, n = this.message.content.length; i < n; i++) {
                strLengthPerChar++;
                strLengthGsm++;
                let curChar = this.message.content[i];
                if (gsm.indexOf(curChar) !== -1) {
                    if (gsmDoubleBytes.indexOf(curChar) !== -1) {
                        strLengthGsm++;
                    }
                } else {
                    gsmCheck = false;
                }
            }

            if (gsmCheck) {
                this.messageValidation = {
                    isGsm: true,
                    limit: 140,
                    length: strLengthGsm,
                    smsCount: (strLengthGsm > 0) ? Math.ceil(strLengthGsm / 140) : 0
                };
            } else {
                this.messageValidation = {
                    isGsm: false,
                    limit: 70,
                    length: strLengthPerChar,
                    smsCount: (strLengthPerChar > 0) ? Math.ceil(strLengthPerChar / 70) : 0
                };
            }
        });

        this.aceOptions = {};
        AceEditor.getEditor((editor) => this.aceOptions = editor);

        this.modal = $uibModalInstance;
    }

    send() {
        this.modal.close(this.message);
    }

    cancel() {
        this.modal.dismiss('cancel');
    }
}

function sendSms(Alert, locale, $http, $uibModal) {
    return {
        key: 'send-sms',
        title: 'Send SMS',
        level: 'selected',
        action({}, store) {

            $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: templateUrl,
                controller: ['ResourceCommon', '$uibModalInstance', 'Users', '$scope', SmsModalCtrl],
                controllerAs: 'vm'
            }).result.then(message => {
                message[store.state.slug] = store.getters.selectedFilters;
                message.recipient_type = store.state.type;
                return locale.ready('sweetalerts')
                    .then(() => {
                        return $http.post('messages/', message)
                            .then(response => {
                                store.dispatch('getData');
                                Alert.success(locale.getString('sweetalerts.sms_report'), response.message);
                            }, response => Alert.handle(response));
                    });
            }, response => Alert.handle(response));

        }
    }
}


angular
    .module('airlst.contacts')
    .factory('sendSms', [
        'Alert',
        'locale',
        '$http',
        '$uibModal',
        sendSms
    ]);
