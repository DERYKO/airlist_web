class createContact {
    constructor($state) {

        this.key = 'create-contact';
        this.title = 'Add New   ';
        this.level = 'highlight';
        this.icon = 'plus-circle';
        this.order = 10;
        this.state = $state;
    }

    action(payload, store) {
        return this.state.go('app.contacts.create', {store: store});
    }

}

angular
    .module('airlst.contacts')
    .factory('createContact', [
        '$state',
        $state => new createContact($state)
    ]);
