class viewContact {
    constructor($state) {

        this.key = 'view-contact';
        this.title = 'Details';
        this.level = 'row';
        this.icon = '';
        this.state = $state;
    }

    action(payload, store) {
        const index = _.findIndex(store.state.data, {id: payload.row.id});
        return this.state.go('app.contacts.details', {id: payload.row.id, contact: payload.row, store: store, index});
    }

}

angular
    .module('airlst.contacts')
    .factory('viewContact', [
        '$state',
        $state => new viewContact($state)
    ]);
