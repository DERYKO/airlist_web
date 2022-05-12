class archiveContact {
    constructor(Alert, $http, $state) {

        this.key = 'archive-contact';
        this.title = 'Move to trash';
        this.level = 'highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.api = $http;
        this.order = 110;
        this.state = $state;
    }

    action(contact, vm) {
        this.alert.confirm({
            title: `Deleting ${ contact.full_name}`,
            message: 'Are you sure you want to move contact to trash?',
            confirmBtn: 'Delete'
        }).then(() => {
            return this.api.delete(`contacts/${ contact.id }`)
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
    .factory('archiveContact', [
        'Alert',
        '$http',
        '$state',
        (Alert, $http, $state) => new archiveContact(Alert, $http, $state)
    ]);
