class deleteContact {
    constructor(Alert, $http, $state, $stateParams) {

        this.key = 'delete-contact';
        this.title = 'Delete';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
        this.back = $stateParams.back;
        this.params = $stateParams.backParams || {
            id: $stateParams.id
        };
    }

    action(contact, vm) {
        this.alert.confirm({
            title: `Deleting ${ contact.full_name}`,
            message: 'Are you sure you want to delete contact? This cannot be undone!',
            confirmBtn: 'Delete'
        }).then(() => {
            return this.api.delete(`contacts/${ contact.id }`, {data: {force: true}})
                .then(() => {
                    return this.state.go(this.back, this.params);
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.contacts')
    .factory('deleteContact', [
        'Alert',
        '$http',
        '$state',
        '$stateParams',
        (Alert, $http, $state, $stateParams) => new deleteContact(Alert, $http, $state, $stateParams)
    ]);

