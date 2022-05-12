class restorePdfTicket {
    constructor($state, $http, alert) {
        this.key = 'restore-pdf-ticket';
        this.title = 'Restore';
        this.level = 'archived-highlight';
        this.icon = 'undo';
        this.order = 15;
        this.state = $state;
        this.http = $http;
        this.alert = alert;
    }

    action(model, vm) {
        this.http.put(`tickets/${vm.model.id}/restore`)
            .then(() => {
                this.state.go('app.tickets.details', {id: vm.model.id}, {reload: true});
            }, err => this.alert.handle(err));
    }

}

angular
    .module('airlst.tickets')
    .factory('restorePdfTicket', [
        '$state',
        '$http',
        'Alert',
        ($state, $http, Alert) => new restorePdfTicket($state, $http, Alert)
    ]);
