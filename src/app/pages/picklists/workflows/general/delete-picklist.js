class DeletePicklist {
    constructor(Alert, $http, $state, $stateParams, SweetAlert) {

        this.key = 'archive-picklist';
        this.title = 'Archive';
        this.level = 'archived-highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.api = $http;
        this.sweetAlert = SweetAlert;
        this.order = 15;
        this.state = $state;
        this.back = $stateParams.back;
        this.params = $stateParams.backParams || {
            id: $stateParams.id
        };
    }

    action({},store) {
        this.alert.confirm({
            title: `Deleting ${ store.state.vm.picklist.name}`,
            message: 'Are you sure you want to permanently delete this picklist? This can not be undone!',
            confirmBtn: 'Yes, delete permanently'
        }).then(() => {
            return this.api.delete(`picklists/${ store.state.vm.picklist.id }`, {data: {force: true}})
                .then(() => {
                    this.sweetAlert.success('Success', 'The picklist was deleted successful');
                    return this.state.go(this.back, this.params);
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.picklists')
    .factory('deletePicklist', [
        'Alert',
        '$http',
        '$state',
        '$stateParams',
        'SweetAlert',
        (Alert, $http, $state, $stateParams, SweetAlert) => new DeletePicklist(Alert, $http, $state, $stateParams, SweetAlert)
    ]);

