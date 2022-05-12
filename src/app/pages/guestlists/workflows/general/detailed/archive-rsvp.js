class archiveRsvp {
    constructor(Alert, $http, $state) {

        this.key = 'archive-rsvp';
        this.title = 'Move to trash';
        this.level = 'highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.api = $http;
        this.order = 50;
        this.state = $state;
    }

    action(rsvp, vm) {
        this.alert.confirm({
            title: `Confirm Deletion?`,
            message: `Do you really want to delete this guest? Please note that guests of guest are also deleted if they are attached.`,
            confirmBtn: 'Confirm'
        }).then(() => {
            return this.api.delete(`guestlists/${ vm.guestlist.id }/rsvps/${ rsvp.id }`)
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
    .module('airlst.guestlists')
    .factory('archiveRsvp', [
        'Alert',
        '$http',
        '$state',
        (Alert, $http, $state) => new archiveRsvp(Alert, $http, $state)
    ]);
