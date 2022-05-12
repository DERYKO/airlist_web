class PicklistContactsListCtrl {
    constructor($auth, $stateParams, Picklist, Contacts, NavService, Workflows) {

        this.stateParams = $stateParams;
        this.store = Contacts.reset({listview: `Picklist${ $stateParams.pid }ContactsListView`});
        this.navService = NavService;
        this.model = Picklist;
        this.workflows = Workflows;
        this.updatePicklist();

        this.store.commit('setPrefix', `picklists/${this.stateParams.pid}`);
        this.store.commit('updateColumn', {
            key: 'picklist.id',
            filterable: true
        });
        this.store.commit('setAutoFilters', {'picklist_id': this.stateParams.pid});
        this.store.commit('setEmptyListActions', [
            'add-contacts-to-picklist'
        ]);
        this.store.dispatch('loadWorkflows', 'picklists::contact-list');
        this.store.commit('setVm', this);
    }

    updatePicklist() {
        if (this.stateParams.picklist) {
            this.picklist = this.stateParams.picklist;
            this.updateCustomActions();
        } else {
            this.model.get(this.stateParams.pid).then((picklist) => {
                this.picklist = picklist;
                this.updateCustomActions();
            });
        }
    }

    updateCustomActions() {
        this.navService.setBreadcrumbParameters({
            picklist_name: this.picklist.name
        });
    }
}

PicklistContactsListCtrl.$inject = [
    '$auth',
    '$stateParams',
    'Picklist',
    'Contacts',
    'NavService',
    'Workflows'
];

angular
    .module('airlst.picklists')
    .controller('PicklistContactsListCtrl', PicklistContactsListCtrl);
