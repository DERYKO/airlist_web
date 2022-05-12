class ContactsListCtrl {
    constructor(Contacts, NavService, $stateParams, Users, $scope) {
        this.usersStore = Users;
        this.scope = $scope;
        this.store = $stateParams.store || Contacts.reset().dispatch('loadState');
        this.store.dispatch('loadWorkflows', 'addressbook::list');
        this.store.commit('setVm', this);
        this.store.resetGetters();
        NavService.shouldShowBackBtn(false);

        this.pusherCall = null;
        this.initiatePusher();
    }

    initiatePusher() {
        this.pusher = this.usersStore.dispatch('getPusher');
        this.pusher.bind('job-log-state-change', this.pusherEventHandler, this);

        this.scope.$on('$destroy', () => {
            this.pusher.unbind('job-log-state-change', this.pusherEventHandler);
        })
    }

    pusherEventHandler(event) {
        const reloadTriggeringActions = [
            'bulk_update_resources',
            'bulk_archive_resources',
            'bulk_delete_resources',
            'bulk_restore_resources'
        ];
        if (_.get(event, 'status') === 'success'
            && reloadTriggeringActions.indexOf(event.log.job_name) !== -1) {
            this.store.dispatch('getData');
        }
    }
}


angular
    .module('airlst.contacts')
    .controller('ContactsListCtrl', ['Contacts', 'NavService', '$stateParams', 'Users', '$scope', ContactsListCtrl]);

