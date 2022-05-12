import '../store/tickets'

angular
    .module('airlst.tickets')
    .controller('TicketsCtrl', [
        'Tickets',
        '$state',
        TicketsCtrl
    ]);

function TicketsCtrl(Tickets, $state) {

    var vm = this;

    init();

    function init() {
        vm.store = Tickets;
        vm.show = showTicket;
        vm.store.dispatch('loadWorkflows', 'tickets::list');
        vm.store.commit('setVm', vm);
    }

    function showTicket(payload) {
        $state.go('app.tickets.details', {id: payload.row.id, store: vm.store}, {location: true});
    }
}
