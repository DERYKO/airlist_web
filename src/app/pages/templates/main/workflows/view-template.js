class viewTemplate {
    constructor($state) {
        this.key = 'view-template';
        this.title = 'Details';
        this.level = 'row';
        this.state = $state;
    }

    action(payload, store) {
        return this.state.go('app.templates.main.details', {id: payload.row.id, store: store});
    }

}

angular
    .module('airlst.users')
    .factory('viewTemplate', [
        '$state',
        $state => new viewTemplate($state)
    ]);
