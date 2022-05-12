class restorePassbook {
    constructor($state, $http, alert) {

        this.key = 'restore-passbook';
        this.title = 'Restore';
        this.level = 'archived-highlight';
        this.icon = 'undo';
        this.state = $state;
        this.http = $http;
        this.alert = alert;
    }

    action(passbook, vm) {
        this.http.put(`passbooks/${ vm.model.id }/restore`)
            .then(() => {
                this.state.go('app.passbooks.details', {id: vm.model.id}, {reload: true});
            }, err => this.alert.handle(err));
    }


}

angular
    .module('airlst.passbooks')
    .factory('restorePassbook', [
        '$state',
        '$http',
        'Alert',
        ($state, $http, Alert) => new restorePassbook($state, $http, Alert)
    ]);
