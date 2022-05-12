class archivePdfTicket {
    constructor($state, $http, alert) {
        this.key = 'archive-pdf-ticket';
        this.title = 'Delete';
        this.level = 'highlight';
        this.icon = 'trash';
        this.order = 15;
        this.state = $state;
        this.http = $http;
        this.alert = alert;
    }

    action(model, vm) {
        this.alert.confirm({
            title: 'Confirm Ticket Deletion',
            message: `Are you sure you want to delete the ticket: ${vm.model.name}`,
            confirmBtn: 'Delete'
        })
            .then(() => {
                this.http.delete(`tickets/${vm.model.id}`, {
                    data: {force: vm.model.archived}
                })
                    .then(() => {
                        this.state.go('app.tickets.details', {id: vm.model.id}, {reload: true});
                    }, err => this.alert.handle(err));
            }, err => this.alert.handle(err));
    }

}

angular
    .module('airlst.tickets')
    .factory('archivePdfTicket', [
        '$state',
        '$http',
        'Alert',
        ($state, $http, Alert) => new archivePdfTicket($state, $http, Alert)
    ]);
