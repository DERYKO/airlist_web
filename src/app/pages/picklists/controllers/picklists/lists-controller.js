import '../../store/picklists';

angular
    .module('airlst.picklists')
    .controller('PicklistsCtrl', [
        'Picklists',
        '$state',
        PicklistsCtrl
    ]);

function PicklistsCtrl(Picklists, $state) {

    var vm = this;
    vm.route = 'picklists';

    init();

    function init() {
        vm.store = Picklists;
        vm.store.commit('setVm', vm);
        vm.store.dispatch('loadWorkflows', 'picklists::list');
        vm.addNew = addNew;
        vm.showContacts = showContacts;
        vm.updateMany = updateMany;
    }

    function addNew() {
        $state.go('app.picklists.create', {store: vm.store});
    }

    function showContacts(payload) {
        return $state.go('app.picklists.contacts.index', {pid: payload.row.id});
    }

    function updateMany() {
        $state.go('app.picklists.multiple', {store: vm.store});
    }
}
