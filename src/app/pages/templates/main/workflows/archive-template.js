class archiveTemplate {
    constructor(Alert, $http, $state) {

        this.key = 'archive-template';
        this.title = 'Move to trash';
        this.level = 'highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.order = 50;
        this.api = $http;
        this.state = $state;
    }

    action(template, vm) {
        this.alert.confirm({
            title: `Deleting ${ template.name}`,
            message: 'Are you sure you want to move this template to trash?',
            confirmBtn: 'Delete'
        }).then(() => {
            return this.api.delete(`templates/${ template.id }`)
                .then(() => {
                    this.state.reload();
                    if (vm.store) {
                        return vm.store.dispatch('getData');
                    }
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.templates.main')
    .factory('archiveTemplate', [
        'Alert',
        '$http',
        '$state',
        (Alert, $http, $state) => new archiveTemplate(Alert, $http, $state)
    ]);
