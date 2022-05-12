import AbstractAlGuestlistEditorPagesController from '../../abstracts/abstract-page-controller';

export default class AlGuestlistEditorPageTicketsComponentController extends AbstractAlGuestlistEditorPagesController {

    constructor($injector, $scope) {
        super($injector, $scope);

        this.enableTicket = false;
        this.enablePassbook = false;
    }

    _fillModelFromGuestlist() {
        this.model = {
            ticket_id: this.getGuestlistValue('ticket_id'),
            passbook_id: this.getGuestlistValue('passbook_id'),
            settings: {
                attach_ticket_to_confirmation_email: this.getGuestlistValue('settings.attach_ticket_to_confirmation_email'),
                attach_passbook_to_confirmation_email: this.getGuestlistValue('settings.attach_passbook_to_confirmation_email'),
                messages_ticket_flow: this.getGuestlistValue('settings.messages_ticket_flow')
            }
        };

        if (this.model.ticket_id) {
            this.enableTicket = false;
        }
        if (this.model.passbook_id) {
            this.enablePassbook = false;
        }
    }

    openTicketEditor(ticketId) {
        window.open('#!' + this.injector.get('$state').href('app.tickets.edit', {id: ticketId}), '_blank');
    }

    openTicketPreview(ticketId) {
        window.open('#!' + this.injector.get('$state').href('app.tickets.details', {id: ticketId}), '_blank');
    }

    openPassbookEditor(passbookId) {
        window.open('#!' + this.injector.get('$state').href('app.passbooks.edit', {id: passbookId}), '_blank');
    }

    openPassbookPreview(passbookId) {
        window.open('#!' + this.injector.get('$state').href('app.passbooks.details', {id: passbookId}), '_blank');
    }

    _initWatchers() {
        super._initWatchers();

        this.scope.$watch(() => {
            return this.enableTicket;
        }, () => {
            if(!this.enableTicket) {
                this.model.ticket_id = null;
            }
        });

        this.scope.$watch(() => {
            return this.enablePassbook;
        }, () => {
            if(!this.enablePassbook) {
                this.model.passbook_id = null;
            }
        });
    }

    _initFormConfig() {
        this._updateState({
            ...this.state,
            formConfig: {
                ticketsStoreForSelectize: {
                    store: this.injector.get('Tickets').reset({
                        persist: false,
                        listview: 'GuestlistEditorSelectTicketListView'
                    }),
                    displayField: 'name',
                    valueField: 'id'
                },
                passbooksStoreForSelectize: {
                    store: this.injector.get('Passbooks').reset({
                        persist: false,
                        listview: 'GuestlistEditorSelectPassbookListView'
                    }),
                    displayField: 'name',
                    valueField: 'id'
                }
            }
        });

        this.depositService.getRemoteDeposit('guestlists', 'settings', {
            messages_ticket_flows: {}
        }).then((result) => {
            const messageTicketFlows = [];

            _.each(result.messages_ticket_flows, (v, k) => {
                messageTicketFlows.push({
                    value: k,
                    label: v
                });
            });

            this._updateState({
                ...this.state,
                formConfig: {
                    ...this.state.formConfig,
                    messageTicketFlows
                }
            });
        });
    }
}
