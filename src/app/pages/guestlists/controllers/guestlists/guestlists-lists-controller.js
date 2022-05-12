class GuestlistsListCtrl {

    constructor(Guestlists, $stateParams) {
        this.store = $stateParams.store || Guestlists;
        this.store.commit('setVm', this);
        this.store.dispatch('loadWorkflows', 'guestlists::list');
        this.store.resetGetters();
    }
}


GuestlistsListCtrl.$inject = [
    'Guestlists',
    '$stateParams'
];


angular
    .module('airlst.guestlists')
    .controller('GuestlistsListCtrl', GuestlistsListCtrl);
