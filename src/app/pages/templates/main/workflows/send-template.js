import templateUrl from '../views/workflows/send-template.tpl.html'

/**
 * @ngdoc service
 * @name checkins.factory:sendTemplate
 *
 * @description
 *
 */

class sendTemplateCtrl {
    constructor(Alert, Contacts, Rsvps, $http, template, $scope, $uibModalInstance, $sce) {
        this.alert = Alert;
        this.api = $http;
        this.template = template;
        this.modalInstance = $uibModalInstance;
        this.sce = $sce;

        this.message = {
            type: 'email',
            send_to_override: '',
            recipient_type: 'contact',
            templates: {
                filters: [
                    {
                        field: 'id',
                        operator: 'IN',
                        value: [template.id]
                    }
                ],
                count: 1
            },
            attach_ticket: true,
            attach_passbook: true,
            attach_files: true,
            attach_invoice: true
        };

        this.contactsConfig = {
            store: Contacts.reset({persist: false}),
            maxItems: 1,
            displayField: 'full_name'
        }

        this.rsvpsConfig = {
            store: Rsvps.create('TemplateRsvps').reset({persist: false}),
            maxItems: 1,
            displayField: 'contact.full_name'
        }

        this.recipientTypes = {
            type: 'select',
            options: {
                contact: 'Contact',
                rsvp: 'Booking'
            },
            required: true
        }
    }

    close() {
        this.modalInstance.dismiss();
    }


    trustTemplateHtml(string) {
        return this.sce.trustAsHtml(string);
    }

    send(form) {
        if (form.$valid && this.message.send_to_override) {
            if (this.message.recipient_type === 'contact') {
                delete this.message.rsvps;
                this.message.contacts = this.contactsConfig.store.getters.selectedFilters
            } else if (this.message.recipient_type === 'rsvp') {
                delete this.message.contacts;
                this.message.rsvps = this.rsvpsConfig.store.getters.selectedFilters
            }
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


function sendTemplate(Alert, $uibModal) {
    return {
        key: 'email-contact',
        title: 'Send Email',
        icon: 'envelope',
        order: 20,
        level: 'highlight',
        action(template) {
            $uibModal.open({
                templateUrl,
                controller: ['Alert', 'Contacts', 'Rsvps', '$http', 'template', '$scope', '$uibModalInstance', '$sce', sendTemplateCtrl],
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    template() {
                        return template;
                    }
                }
            })
                .result.then(null, err => Alert.handle(err));
        }
    }
}

angular
    .module('airlst.templates.main')
    .factory('sendTemplate', [
        'Alert',
        '$uibModal',
        sendTemplate
    ]);
