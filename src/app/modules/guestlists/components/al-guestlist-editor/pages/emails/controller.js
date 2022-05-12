import AbstractAlGuestlistEditorPagesController from '../../abstracts/abstract-page-controller';

export default class AlGuestlistEditorPageEmailsComponentController extends AbstractAlGuestlistEditorPagesController {

    constructor($scope, $injector) {
        super($scope, $injector);

        this.availableEmailTemplateTypes = {
            invitation_template_id: 'send_invitation_email',
            reminder_template_id: 'send_reminder_email',
            confirmation_template_id: 'send_confirmation_email',
            cancellation_template_id: 'send_cancellation_email',
            request_email_id: 'send_request_email',
            pending_template_id: 'send_pending_email',
            waitlist_template_id: 'send_waitlist_email',
        };

        this.selectedEmailTemplates = {};

        this._initSpecialWatchers();
    }

    openTemplateEditor(templateId) {
        window.open('#!' + this.injector.get('$state').href('app.templates.main.edit', {id: templateId}), '_blank');
    }

    openTemplatePreview(templateId) {
        window.open('#!' + this.injector.get('$state').href('app.templates.main.details', {id: templateId}), '_blank');
    }

    _initSpecialWatchers() {
        this.scope.$watch(() => this.selectedEmailTemplates, (newVal, oldVal) => {
            if (this.model && this.model.settings) {
                _.each(this.availableEmailTemplateTypes, (enableField, emailTypeTemplateIdField) => {
                    if (!_.isEqual(newVal[emailTypeTemplateIdField], oldVal[emailTypeTemplateIdField])) {
                        if (!_.isNull(newVal[emailTypeTemplateIdField])) {
                            this.model.settings[enableField] = true;
                        } else {
                            this.model.settings[enableField] = false;
                        }
                    }
                })
            }
        }, true);
    }

    _initFormConfig() {
        this._updateState({
            ...this.state,
            formConfig: {
                mainRsvpSendFlows: [],
                templatesStoreForSelectize: {
                    store: this.injector.get('Templates').reset({
                        persist: false,
                        listview: 'GuestlistEditorSelectTemplateListView'
                    }),
                    displayField: 'name',
                    valueField: 'id'
                }
            }
        });

        this.depositService.getRemoteDeposit('guestlists', 'settings', {
            main_rsvp_send_flows: {},
            sub_rsvp_send_flows: {},
            messages_ticket_flows: {}
        }).then((result) => {
            const mainRsvpSendFlows = [];

            _.each(result.main_rsvp_send_flows, (v, k) => {
                mainRsvpSendFlows.push({
                    value: k,
                    label: v
                });
            });

            this._updateState({
                ...this.state,
                formConfig: {
                    ...this.state.formConfig,
                    mainRsvpSendFlows: mainRsvpSendFlows
                }
            });
        });
    }

    _fillModelFromGuestlist() {
        this.model = {
            settings: {
                messages_main_rsvp_send_flow: this.getGuestlistValue('settings.messages_main_rsvp_send_flow'),
                send_recommendation_emails: this.getGuestlistValue('settings.send_recommendation_emails'),
                send_representative_emails: this.getGuestlistValue('settings.send_representative_emails'),
                send_guest_emails: this.getGuestlistValue('settings.send_guest_emails')
            }
        };

        this.selectedEmailTemplates = {};

        _.each(this.availableEmailTemplateTypes, (enableField, emailTemplateType) => {
            this.model[emailTemplateType] = this.getGuestlistValue(emailTemplateType);
            this.model.settings[enableField] = this.getGuestlistValue('settings.' + enableField);
            if (this.model.settings[enableField]) {
                this.selectedEmailTemplates[emailTemplateType] = this.model[emailTemplateType];
            } else {
                this.selectedEmailTemplates[emailTemplateType] = null;
            }
        });

        this.scope.$applyAsync();
    }
}
