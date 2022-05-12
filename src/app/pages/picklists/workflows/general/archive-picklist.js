class ArchivePicklist {
    constructor(Alert, $http, $state, $stateParams, SweetAlert) {
        this.key = 'archive-picklist';
        this.title = 'Archive';
        this.level = 'highlight';
        this.icon = 'fal fa-trash-alt';
        this.alert = Alert;
        this.sweetAlert = SweetAlert;
        this.api = $http;
        this.order = 15;
        this.state = $state;
        this.back = $stateParams.back;
        this.params = $stateParams.backParams || {
            id: $stateParams.id
        };
    }

    action({}, store) {
        this.alert.confirm({
            title: `Deleting ${ store.state.vm.picklist.name}`,
            message: 'Are you sure you want to archive this picklist?',
            confirmBtn: 'Archive'
        }).then(() => {
            return this.api.delete(`picklists/${ store.state.vm.picklist.id }`, {data: {force: false}})
                .then(() => {
                    this.sweetAlert.success('Success', 'The picklist was archived successful');
                    return this.state.go(this.back, this.params);
                }, err => this.alert.handle(err));
        }, () => ({}))
    }

}

angular
    .module('airlst.picklists')
    .factory('archivePicklist', [
        'Alert',
        '$http',
        '$state',
        '$stateParams',
        'SweetAlert',
        (Alert, $http, $state, $stateParams, SweetAlert) => new ArchivePicklist(Alert, $http, $state, $stateParams, SweetAlert)
    ]);

