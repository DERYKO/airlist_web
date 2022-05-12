class createRsvp {
    constructor($state) {

        // FIXME workflow not controlled by backend

        this.key = 'create-rsvp';
        this.title = 'Add New ';
        this.level = 'highlight';
        this.icon = 'plus-circle';
        this.order = 10;
        this.state = $state;
    }

    action({}, store) {
        return this.state.go('app.guestlists.rsvps.create', {store: store, backParams: {store: store}});
    }

}

angular
    .module('airlst.guestlists')
    .factory('createRsvp', [
        '$state',
        $state => new createRsvp($state)
    ]);
