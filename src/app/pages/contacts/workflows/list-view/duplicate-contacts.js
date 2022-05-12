class duplicateContacts {
    constructor($state) {

        this.key = 'duplicate-contacts';
        this.title = 'Duplicates';
        this.level = 'highlight';
        this.icon = 'code-merge';
        this.order = 50;
        this.state = $state;
    }

    action({}, store) {
        return this.state.go('app.contacts.duplicates', {store: store});
    }

}

angular
    .module('airlst.contacts')
    .factory('duplicateContacts', [
        '$state',
        $state => new duplicateContacts($state)
    ]);
