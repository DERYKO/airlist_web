class createTemplate {
    constructor($state) {
        this.key = 'create-template';
        this.title = 'Create Template';
        this.level = 'highlight';
        this.icon = 'fal fa-plus-circle';
        this.state = $state;
    }

    action(payload, store) {
        return this.state.go('app.templates.main.create', {store: store});
    }

}

angular
    .module('airlst.templates.main')
    .factory('createTemplate', [
        '$state',
        $state => new createTemplate($state)
    ]);
