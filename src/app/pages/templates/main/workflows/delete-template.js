class deleteTemplate {
    constructor(Alert, $http, $state, $stateParams) {

        this.key = 'delete-template';
        this.title = 'Delete';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.api = $http;
        this.state = $state;
        this.back = $stateParams.back;
        this.params = $stateParams.backParams || {
            id: $stateParams.id
        };
    }

    action(template, vm) {
        this.alert.confirm({
            title: `Deleting ${ template.name}`,
            message: 'Are you sure you want to delete this template? This cannot be undone!',
            confirmBtn: 'Delete'
        }).then(() => {
            return this.api.delete(`templates/${ template.id }`, {data: {force: true}})
                .then(() => {
                    return this.state.go(this.back, this.params);
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.templates.main')
    .factory('deleteTemplate', [
        'Alert',
        '$http',
        '$state',
        '$stateParams',
        (Alert, $http, $state, $stateParams) => new deleteTemplate(Alert, $http, $state, $stateParams)
    ]);

