

export class singleEmailCtrl {
    constructor(Alert, $http, rsvp, $scope, Templates, $uibModalInstance, $sce) {
        this.alert = Alert;
        this.api = $http;
        this.rsvp = rsvp;
        this.scope = $scope;
        this.modalInstance = $uibModalInstance;
        this.sce = $sce;

        this.message = {
            type: 'email',
            send_to_override: (this.rsvp.contact) ? this.rsvp.contact.data.preferred_email : '',
            recipient_type: 'rsvp',
            rsvps: {
                filters: [
                    {
                        field: 'id',
                        operator: 'IN',
                        value: [rsvp.id]
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
            attach_ticket: true,
            attach_passbook: true,
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
        if(this.rsvp.contact) {
            if (this.rsvp.contact.data.email) {
                this.emails.private = this.rsvp.contact.data.email
            }
            if (this.rsvp.contact.data.business_email) {
                this.emails.business = this.rsvp.contact.data.business_email
            }
            this.send_to_override = this.rsvp.contact.data.business_preferred ? 'business' : 'private';
        }

        this.emails.custom = '';
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
                this.api.get(`templates/${ id}`)
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
                this.api.get(`templates/${id}/preview/rsvp/${this.rsvp.id}`)
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
