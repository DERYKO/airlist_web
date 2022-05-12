import singleSmSTemplate from '../../views/workflows/send-single-sms.tpl.html'

/**
 * @ngdoc service
 * @name checkins.factory:smsContact
 *
 * @description
 *
 */

class singleSmSCtrl {
    constructor(Alert, $http, contact, $scope, Templates, Users, $uibModalInstance, ResourceCommon, AceEditor) {
        this.alert = Alert;
        this.api = $http;
        this.contact = contact;
        this.modalInstance = $uibModalInstance;

        this.sender_names = _.get(Users.state.loggedin.profile.company.data, 'settings.messages.sms_sender_names', []);

        this.message = {
            type: 'sms',
            send_to_override: this.contact.preferred_phone_2,
            recipient_type: 'contact',
            contacts: {
                filters: [
                    {
                        field: 'id',
                        operator: 'IN',
                        value: [contact.id]
                    }
                ],
                count: 1
            },
           content:'',
            attach_ticket: false,
            attach_passbook: false,
            attach_files: true,
            attach_invoice: true
        };
        this.setSendToOptions();

        this.messageValidation = {
            isGsm: true,
            limit: 140,
            length: 0,
            smsCount: 0
        };

        this.aceOptions = {};
        AceEditor.getEditor((editor) => this.aceOptions = editor);

        $scope.$watch(()=> this.message.content, () => {
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
    }

    close() {
        this.modalInstance.dismiss();
    }

    setSendToOptions() {
        this.numbers = {};
        if (this.contact.phone_2) {
            this.numbers.private = this.contact.phone_2
        }
        if (this.contact.business_phone_2) {
            this.numbers.business = this.contact.business_phone_2
        }
        this.numbers.custom = '';
        this.send_to_override = this.contact.business_preferred ? 'business' : 'private';
    }

    send(form) {
        if (form.$valid && this.message.content.length) {
            this.sending = true;
            return this.api.post(`messages`, this.message)
                .then(() => {
                    this.alert.success('Message Sent', 'Your message has been queued for sending');
                    this.close();
                }, response => {
                    this.alert.handle(response);
                })
                .finally(() => {
                    this.sending = false;
                });
        }
    }
}


function smsContact(Alert, $uibModal) {
    return {
        key: 'sms-contact',
        title: 'Send SMS',
        icon: 'envelope',
        order: 40,
        level: 'highlight',
        action(contact) {
            $uibModal.open({
                templateUrl: singleSmSTemplate,
                controller: ['Alert', '$http', 'contact', '$scope', 'Templates', 'Users', '$uibModalInstance', 'ResourceCommon', 'AceEditor', singleSmSCtrl],
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    contact() {
                        return contact;
                    }
                }
            })
                .result.then(null, err => Alert.handle(err));
        }
    }
}

angular
    .module('airlst.contacts')
    .factory('smsContact', [
        'Alert',
        '$uibModal',
        smsContact
    ]);
