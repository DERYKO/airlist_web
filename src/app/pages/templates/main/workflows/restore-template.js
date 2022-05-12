class restoreTemplate {
    constructor(Alert, $http, $state) {

        this.key = 'restore-template';
        this.title = 'Restore';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-undo';
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
    }

    action(template, vm) {
        this.alert.confirm({
            title: `Restoring ${ template.name}`,
            message: 'Are you sure you want to restore this template? This cannot be undone!',
            confirmBtn: 'Restore'
        }).then(() => {
            return this.api.put(`templates/${ template.id }/restore`)
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
    .factory('restoreTemplate', [
        'Alert',
        '$http',
        '$state',
        (Alert, $http, $state) => new restoreTemplate(Alert, $http, $state)
    ]);

