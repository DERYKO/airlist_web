class MessagesCreateCtrl {
    constructor(Alert, Contacts, $http, NavService, Templates, $state, $stateParams, $scope, $sce) {
        this.store = $stateParams.store;
        this.template = $stateParams.template;
        this.back = $stateParams.back;
        this.params = $stateParams.backParams || {};
        this.api = $http;
        this.alert = Alert;
        this.state = $state;
        this.sce = $sce;
        this.submitting = false;
        this.setupMessage($stateParams);
        this.setupRecipients($stateParams, Contacts);
        this.setupTemplates(Templates, $scope);
        NavService.setGoBackAction(this.close.bind(this));
    }

    setupRecipients($stateParams, Contacts) {
        if (!$stateParams.recipients) {
            this.contactsConfig = {
                store: Contacts.reset({persist: false}),
                maxItems: 100,
                displayField: 'full_name'
            }
            this.message.contacts = {
                filters: [
                    {
                        field: 'id',
                        operator: 'IN',
                        value: []
                    }
                ],
                count: 0
            }
        } else {
            this.message[`${ $stateParams.type }s`] = $stateParams.recipients.getters.selectedFilters;
        }
    }

    setupTemplates(Templates, $scope) {
        this.templatesConfig = {
            store: Templates.reset({persist: false}),
        };

        this.trackTemplateLoaded($scope)
    }

    setupMessage($stateParams) {
        this.message = {
            type: 'email',
            recipient_type: $stateParams.type,
            templates: {
                filters: [
                    {
                        field: 'id',
                        operator: 'IN',
                        value: []
                    }
                ],
                count: 1
            },
            attach_ticket: true,
            attach_passbook: true,
            attach_files: true,
            attach_invoice: true
        };
    }

    trackTemplateLoaded($scope) {
        $scope.$watch(() => this.message.templates.filters[0].value[0], id => {
            if (id) {
                this.api.get(`templates/${ id}`).then(response => {
                    this.template = response.data.data;
                }, response => this.alert.handle(response));
            }
        });
    }

    trustTemplateHtml(string) {
        return this.sce.trustAsHtml(string);
    }

    send() {
        this.submitting = true;
        if (this.message.contacts && !this.message.contacts.count) {
            this.message.contacts.count = this.message.contacts.filters[0].value.length;
        } else if (this.message.rsvps && !this.message.rsvps.count) {
            this.message.rsvps.count && this.message.rsvps.filters[0].value.length;
        }

        this.api.post(`messages`, this.message)
            .then(() => {
                this.alert.success('Message Sent', 'Your message has been queued for sending');
                if (this.store) {
                    this.store.dispatch('getData');
                }
                this.close();
            }, (response) => {
                this.alert.handle(response);
                this.submitting = false
            });
    }

    close() {
        const params = _.cloneDeep(this.params);
        params.store = this.store;
        this.state.go(this.back, params);
    }

}

angular
    .module('airlst.messages')
    .controller('MessagesCreateCtrl', [
        'Alert',
        'Contacts',
        '$http',
        'NavService',
        'Templates',
        '$state',
        '$stateParams',
        '$scope',
        '$sce',
        MessagesCreateCtrl
    ]);
