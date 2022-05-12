class viewUser {
    constructor($state) {

        this.key = 'view-user';
        this.title = 'Details';
        this.level = 'row';
        this.state = $state;
    }

    action(payload, store) {
        return this.state.go('app.users.details', {id: payload.row.id, store: store});
    }

}

angular
    .module('airlst.users')
    .factory('viewUser', [
        '$state',
        $state => new viewUser($state)
    ]);
