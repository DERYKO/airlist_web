class importContacts {
    constructor($state) {

        this.key = 'import-contacts';
        this.title = 'Import ';
        this.level = 'highlight';
        this.icon = 'download';
        this.order = 30;
        this.state = $state;
    }

    action(payload, store) {
        return this.state.go('app.contacts.import', {store: store});
    }

}

angular
    .module('airlst.contacts')
    .factory('importContacts', [
        '$state',
        $state => new importContacts($state)
    ]);
