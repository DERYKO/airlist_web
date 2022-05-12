class createPassbook {
    constructor($state) {
        this.key = 'create-passbook';
        this.title = 'Create a new Passbook';
        this.level = 'highlight';
        this.icon = 'plus-circle';
        this.order = 10;
        this.state = $state;
    }

    action({}, store) {
        return this.state.go('app.passbooks.create', {store: store, backParams: {store: store}});
    }

}

angular
    .module('airlst.guestlists')
    .factory('createPassbook', [
        '$state',
        $state => new createPassbook($state)
    ]);
