import '../store/passbooks';

angular
    .module('airlst.passbooks')
    .controller('PassbooksCtrl', [
        'Passbooks',
        '$state',
        PassbooksCtrl
    ]);

function PassbooksCtrl(Passbooks, $state) {

    var vm = this;

    init();

    function init() {
        vm.store = Passbooks;
        vm.show = showPassbook;
        vm.store.dispatch('loadWorkflows', 'passbooks::list');
        vm.store.commit('setVm', vm);
    }

    function showPassbook(payload) {
        $state.go('app.passbooks.details', {id: payload.row.id, store: vm.store}, {location: true});
    }
}
