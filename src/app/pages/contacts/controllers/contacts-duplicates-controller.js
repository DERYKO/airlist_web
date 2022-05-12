class ContactsDuplicatesCtrl {
    constructor(Contacts, $state) {
        this.store = Contacts.reset({listview: 'DuplicateContactsView'});
        this.store.commit('setPermanentFilters', {has_duplicates: true});
        this.store.dispatch('loadWorkflows', 'addressbook::duplicates');
        this.store.commit('disableExtendedListView');
        this.store.commit('setVm', this);
        this.router = $state;
    }

    show(row) {
        this.router.go('app.contacts.duplicate', {id: row.id});
    }
}


angular
    .module('airlst.contacts')
    .controller('ContactsDuplicatesCtrl', [
        'Contacts',
        '$state',
        ContactsDuplicatesCtrl
    ]);
