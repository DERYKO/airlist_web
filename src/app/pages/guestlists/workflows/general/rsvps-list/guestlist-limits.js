angular
    .module('airlst.guestlists')
    .factory('guestlistLimits', [
        '$state',
        ($state) => new GuestlistLimits($state)
    ]);

class GuestlistLimits {
    constructor($state) {
        this.state = $state;

        this.key = 'guestlist-limits';
        this.title = 'Field limits';
        this.level = 'highlight';
        this.icon = 'tachometer-alt';
    }

    action(action, store) {
        this.state.go('app.guestlists.rsvps.limits', {gid:store.state.vm.guestlist.id});
    }
}
