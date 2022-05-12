class deleteMessage {
    constructor(Alert, $http, $state, $stateParams) {

        this.key = 'delete-message';
        this.title = 'Delete';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.api = $http;
        this.order = 15;
        this.state = $state;
        this.back = $stateParams.back;
        this.params = $stateParams.backParams || {
            id: $stateParams.id
        };
    }

    action(message, vm) {
        this.alert.confirm({
            title: `Deleting ${ message.subject || 'Message'}`,
            message: 'Are you sure you want to delete message? This cannot be undone!',
            confirmBtn: 'Delete'
        }).then(() => {
            return this.api.delete(`messages/${ message.id }`, {data: {force: true}})
                .then(() => {
                    return this.state.go(this.back, this.params);
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.messages')
    .factory('deleteMessage', [
        'Alert',
        '$http',
        '$state',
        '$stateParams',
        (Alert, $http, $state, $stateParams) => new deleteMessage(Alert, $http, $state, $stateParams)
    ]);

