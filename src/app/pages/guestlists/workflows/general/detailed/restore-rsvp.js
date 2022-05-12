class restoreRsvp {
    constructor(Alert, $http, $state) {

        this.key = 'restore-rsvp';
        this.title = 'Restore';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-undo';
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
    }

    action(rsvp, vm) {
        this.alert.confirm({
            title: `Restore Booking for ${ rsvp.contact.data.full_name}`,
            message: 'Are you sure you want to restore this booking? This cannot be undone!',
            confirmBtn: 'Restore'
        }).then(() => {
            return this.api.put(`guestlists/${ vm.guestlist.id }/rsvps/${ rsvp.id }/restore`)
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
    .factory('restoreRsvp', [
        'Alert',
        '$http',
        '$state',
        (Alert, $http, $state) => new restoreRsvp(Alert, $http, $state)
    ]);

