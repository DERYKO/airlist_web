class viewMessage {
    constructor($state) {

        this.key = 'view-message';
        this.title = 'Details';
        this.level = 'row';
        this.icon = '';
        this.state = $state;
    }

    action({row}, store) {
        return this.state.go('app.messages.details', {id: row.id, message: row, store: store});
    }

}

angular
    .module('airlst.messages')
    .factory('viewMessage', [
        '$state',
        $state => new viewMessage($state)
    ]);
