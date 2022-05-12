class editTemplate {
    constructor($state) {

        this.key = 'edit-template';
        this.title = 'Edit';
        this.level = 'highlight';
        this.icon = 'fal fa-pencil';
        this.order = 10;
        this.state = $state;
    }

    action(template, vm) {
        this.state.go('app.templates.main.edit', {id: template.id, template: template});
    }

}

angular
    .module('airlst.templates.main')
    .factory('editTemplate', [
        '$state',
        ($state) => new editTemplate($state)
    ]);
