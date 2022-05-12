class restoreContact {
    constructor(Alert, $http, $state) {

        this.key = 'restore-contact';
        this.title = 'Restore';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-undo';
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
    }

    action(contact, vm) {
        this.alert.confirm({
            title: `Restoring ${ contact.full_name}`,
            message: 'Are you sure you want to restore contact? This cannot be undone!',
            confirmBtn: 'REstore'
        }).then(() => {
            return this.api.put(`contacts/${ contact.id }/restore`)
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
    .module('airlst.contacts')
    .factory('restoreContact', [
        'Alert',
        '$http',
        '$state',
        (Alert, $http, $state) => new restoreContact(Alert, $http, $state)
    ]);

