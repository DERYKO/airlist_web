class archiveMessage {
    constructor(Alert, $http, $state, SweetAlert) {

        this.key = 'archive-message';
        this.title = 'Move to trash';
        this.level = 'highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.api = $http;
        this.order = 45;
        this.state = $state;
        this.sweetAlert = SweetAlert;
    }

    action(message, vm) {
        this.alert.confirm({
            title: `Deleting ${ message.subject || 'Message' }`,
            message: 'Are you sure you want to move message to trash?',
            confirmBtn: 'Delete'
        }).then(() => {
            return this.api.delete(`messages/${ message.id }`)
                .then(() => {
                    this.sweetAlert.success('Success', 'Messages was moved to trash');
                    this.state.go('app.messages.index');
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.messages')
    .factory('archiveMessage', [
        'Alert',
        '$http',
        '$state',
        'SweetAlert',
        (Alert, $http, $state, SweetAlert) => new archiveMessage(Alert, $http, $state, SweetAlert)
    ]);
