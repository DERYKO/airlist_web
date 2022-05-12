class downloadPassbook {
    constructor($state, $http, Alert, ResourceSelect, FileSaver) {

        this.key = 'download-passbook';
        this.title = 'Download Example';
        this.level = 'highlight';
        this.icon = 'upload';
        this.state = $state;
        this.http = $http;
        this.alert = Alert
        this.resourceSelect = ResourceSelect
        this.fileSaver = FileSaver
    }

    action(passbook, vm) {
        this.resourceSelect.selectRsvpOrContactModal('Passbook').then(function (selected) {
            switch (selected.type) {
                case 'contact':
                    selected.contact_id = selected.id;
                    break;
                case 'rsvp':
                    selected.rsvp_id = selected.id;
                    break;
            }

            this.http.post('passbooks/' + vm.model.id + '/download', selected, {responseType: "blob"}).then(function (response) {
                const blob = new Blob([response.data], {type: response.headers('content-type')});
                this.fileSaver.saveAs(blob, _.snakeCase(vm.model.name).concat('.pkpass'));
            }.bind(this), err => this.alert.handle(err));
        }.bind(this));
    }

}

angular
    .module('airlst.passbooks')
    .factory('downloadPassbook', [
        '$state',
        '$http',
        'Alert',
        'ResourceSelect',
        'FileSaver',
        ($state, $http, Alert, ResourceSelect, FileSaver) => new downloadPassbook($state, $http, Alert, ResourceSelect, FileSaver)
    ]);
