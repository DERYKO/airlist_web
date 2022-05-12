class editPdfTicket {
    constructor($state) {
        this.key = 'edit-pdf-ticket';
        this.title = 'Edit Ticket';
        this.level = 'highlight';
        this.icon = 'pencil';
        this.order = 15;
        this.state = $state;
    }

    action(model, vm) {
        return this.state.go('app.tickets.edit', {id: vm.model.id, ticket: vm.model, store: vm.store});
    }

}

angular
    .module('airlst.tickets')
    .factory('editPdfTicket', [
        '$state',
        $state => new editPdfTicket($state)
    ]);
