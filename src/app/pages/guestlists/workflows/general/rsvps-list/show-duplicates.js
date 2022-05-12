angular
    .module('airlst.guestlists')
    .factory('showRsvpDuplicates', [
        '$state',
        ($state) => new ShowRsvpDuplicates($state)
    ]);

class ShowRsvpDuplicates {
    constructor($state) {
        this.state = $state;

        this.key = 'show-rsvp-duplicates';
        this.title = 'Duplicates';
        this.level = 'highlight';
        this.icon = 'code-merge';
    }

    action(action, store, newValue) {
        this.state.go('app.guestlists.rsvps.duplicates', {
            gid: store.state.vm.guestlist.id
        });
    }
}
