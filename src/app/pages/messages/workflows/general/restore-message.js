class restoreMessage {
    constructor(Alert, $http, $state) {

        this.key = 'restore-message';
        this.title = 'Restore';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-undo';
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
    }

    action(message, vm) {
        this.alert.confirm({
            title: `Restoring ${ message.subject || 'Message'}`,
            message: 'Are you sure you want to restore message? This cannot be undone!',
            confirmBtn: 'REstore'
        }).then(() => {
            return this.api.put(`messages/${ message.id }/restore`)
                .then(() => {
                    this.state.reload();
                    if (vm.store) {
                        return vm.store.dispatch('getData');
                    }
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.messages')
    .factory('restoreMessage', [
        'Alert',
        '$http',
        '$state',
        (Alert, $http, $state) => new restoreMessage(Alert, $http, $state)
    ]);

