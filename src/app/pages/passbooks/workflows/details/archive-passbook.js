class archivePassbook {
    constructor($state, $http, Alert) {

        this.key = 'archive-passbook';
        this.title = 'Delete';
        this.level = 'highlight';
        this.icon = 'trash';
        this.state = $state;
        this.http = $http;
        this.alert = Alert
    }

    action(passbook, vm) {
        this.alert.confirm({
            title: 'Confirm Apple Wallet Deletion',
            message: `Are you sure you want to delete the apple wallet: ${ vm.model.name }`,
            confirmBtn: 'Delete'
        })
            .then(() => {
                this.http.delete(`passbooks/${ vm.model.id }`, {
                    data: {force: vm.model.archived}
                })
                    .then(() => {
                        this.state.go('app.passbooks.details', {id: vm.model.id}, {reload: true});
                    }, err => this.alert.handle(err));
            }, err => this.alert.handle(err));
    }

}

angular
    .module('airlst.passbooks')
    .factory('archivePassbook', [
        '$state',
        '$http',
        'Alert',
        ($state, $http, Alert) => new archivePassbook($state, $http, Alert)
    ]);
