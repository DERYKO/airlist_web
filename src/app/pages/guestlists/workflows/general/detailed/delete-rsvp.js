class deleteRsvp {
    constructor(Alert, $http, $state, $stateParams) {

        this.key = 'delete-rsvp';
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

    action(rsvp, vm) {
        this.alert.confirm({
            title: `Confirm permanent deletion?`,
            message: `Do you really want to permanently delete this guest? Please note that guests of guest are also deleted if they are attached. This can not be undone!`,
            confirmBtn: 'Confirm'
        }).then(() => {
            return this.api.delete(`guestlists/${ vm.guestlist.id }/rsvps/${ rsvp.id }`, {data: {force: true}})
                .then(() => {
                    return this.state.go(this.back, this.params);
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.guestlists')
    .factory('deleteRsvp', [
        'Alert',
        '$http',
        '$state',
        '$stateParams',
        (Alert, $http, $state, $stateParams) => new deleteRsvp(Alert, $http, $state, $stateParams)
    ]);

