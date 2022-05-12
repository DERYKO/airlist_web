class deletePassbook {
    constructor($state, $http, alert) {

        this.key = 'delete-passbook';
        this.title = 'Permanently Delete';
        this.level = 'archived-highlight';
        this.icon = 'trash';
        this.state = $state;
        this.http = $http;
        this.alert = alert;
    }

    action(passbook, vm) {
        this.alert.confirm({
            title: 'Confirm Ticket Deletion',
            message: `Are you sure you want to permanently delete the ticket: ${vm.model.name}`,
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
    .module('airlst.passbooks')
    .factory('deletePassbook', [
        '$state',
        '$http',
        'Alert',
        ($state, $http, Alert) => new deletePassbook($state, $http, Alert)
    ]);
