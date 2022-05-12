class editRsvp {
    constructor($stateParams, $state) {

        this.key = 'edit-rsvp';
        this.title = 'Edit';
        this.level = 'highlight';
        this.icon = 'pencil';
        this.params = $stateParams;
        this.order = 10;
        this.state = $state;
    }

    action(rsvp, vm) {
        const params = {
            id: rsvp.id,
            gid: vm.guestlist.id,
            store: vm.store,
            rsvp: rsvp,
            guestlist: vm.guestlist,
            back: this.params.back,
            backParams: this.params.backParams,
        };

        return this.state.go('app.guestlists.rsvps.edit', {
            id: rsvp.id,
            gid: vm.guestlist.id,
            store: vm.store,
            rsvp: rsvp,
            guestlist: vm.guestlist,
            backParams: params
        });
    }
}

angular
    .module('airlst.guestlists')
    .factory('editRsvp', [
        '$stateParams',
        '$state',
        (Alert, $stateParams, $state) => new editRsvp(Alert, $stateParams, $state)
    ]);
