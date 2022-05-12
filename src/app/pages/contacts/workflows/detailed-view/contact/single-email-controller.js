export class singleEmailCtrl {
    constructor(Alert, $http, contact, $scope, Templates, $uibModalInstance, $sce) {
        this.alert = Alert;
        this.api = $http;
        this.contact = contact;
        this.modalInstance = $uibModalInstance;
        this.sce = $sce;
        this.scope = $scope;

        this.message = {
            type: 'email',
            send_to_override: this.contact.preferred_email,
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
            attach_ticket: false,
            attach_passbook: false,
            attach_files: true,
            attach_invoice: true
        };

        this.setSendToOptions();
        this.setTemplateConfig(Templates, $scope);
        this.setPreview($scope);
    }

    close() {
        this.modalInstance.dismiss();
    }

    setSendToOptions() {
        this.emails = {};
        if (this.contact.email) {
            this.emails.private = this.contact.email
        }
        if (this.contact.business_email) {
            this.emails.business = this.contact.business_email
        }
        this.emails.custom = '';
        this.send_to_override = this.contact.business_preferred ? 'business' : 'private';
    }

    trustTemplateHtml(string) {
        return this.sce.trustAsHtml(string);
    }

    setTemplateConfig(Templates, $scope) {
        this.templatesConfig = {
            store: Templates.reset({persist: false}),
        };

        $scope.$watch(() => this.message.templates.filters[0].value[0], id => {
            if (id) {
                this.loading = true;
                this.api.get(`templates/${id}`)
                    .then(response => {
                        this.template = response.data.data;
                    }, response => this.alert.handle(response))
                    .finally(() => {
                        this.loading = false;
                    });
            }
        });
    }

    setPreview($scope) {
        $scope.$watch(() => this.message.templates.filters[0].value[0], id => {
            if (id) {
                this.loading = true;
                this.api.get(`templates/${id}/preview/contact/${this.contact.id}`)
                    .then(response => {
                        this.preview = response.data;
                        this.scope.$applyAsync();
                        setTimeout(() => {
                            this.fillIframe();
                        }, 100);
                    }, response => this.alert.handle(response))
                    .finally(() => {
                        this.loading = false;
                    });
            }
        });
    }



    fillIframe() {
        const iFrame = angular.element('#message-preview-iframe');
        var iframeDoc = iFrame[0].contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(this.preview);
        iframeDoc.close();
    }

    send(form) {
        if (form.$valid && this.message.templates.filters[0].value.length) {
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
