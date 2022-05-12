class createTicket {
    constructor($state) {

        this.key = 'create-ticket';
        this.title = 'Create a new ticket';
        this.level = 'highlight';
        this.icon = 'plus-circle';
        this.order = 10;
        this.state = $state;
    }

    action({}, store) {
        return this.state.go('app.tickets.create', {store: store, backParams: {store: store}});
    }

}

angular
    .module('airlst.tickets')
    .factory('createTicket', [
        '$state',
        $state => new createTicket($state)
    ]);
