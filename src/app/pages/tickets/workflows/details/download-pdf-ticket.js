
class downloadPdfTicket {
    constructor($state, $http, ResourceSelect, FileSaver) {
        this.key = 'download-pdf-ticket';
        this.title = 'Download Example';
        this.level = 'highlight';
        this.icon = 'upload';
        this.order = 15;
        this.state = $state;
        this.$http = $http;
        this.resourceSelect = ResourceSelect;
        this.fileSaver = FileSaver;
    }

    action(model, vm) {
        this.resourceSelect.selectRsvpOrContactModal('Ticket').then(function (selected) {
            switch (selected.type) {
                case 'contact':
                    selected.contact_id = selected.id;
                    break;
                case 'rsvp':
                    selected.rsvp_id = selected.id;
                    break;
            }

            this.$http.post('tickets/' + vm.model.id + '/download', selected, {responseType: "blob"}).then(function (response) {
                const blob = new Blob([response.data], {type: response.headers('content-type')});
                this.fileSaver.saveAs(blob, _.snakeCase(vm.model.name).concat('.pdf'));
            }.bind(this), function (error) {
                Error.default(error);
            });
        }.bind(this));
    }

}

angular
    .module('airlst.tickets')
    .factory('downloadPdfTicket', [
        '$state',
        '$http',
        'ResourceSelect',
        'FileSaver',
        ($state, $http ,ResourceSelect, FileSaver)=> new downloadPdfTicket($state, $http,ResourceSelect, FileSaver)
    ]);
