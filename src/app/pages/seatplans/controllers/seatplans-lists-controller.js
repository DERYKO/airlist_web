import '../store/seatplans';

angular
    .module('airlst.seatplans')
    .controller('SeatplansListCtrl', [
        'Seatplans',
        '$state',
        SeatplansListCtrl
    ]);

function SeatplansListCtrl(Seatplans, $state) {

    var vm = this;

    init();

    function init() {
        vm.addNew = addNew;
        vm.showSeatplan = showSeatplan;
        vm.deleteSeatplan = deleteSeatplan;
        vm.editSeatplan = editSeatplan;
        vm.store = Seatplans;
        vm.store.commit('setVm', vm);

    }

    function addNew() {
        $state.go('app.seatplans.create', {store: vm.store});
    }

    function showSeatplan(payload) {
        $state.go('app.seatplans.details', {id: payload.row.id, store: vm.store});
    }

    function deleteSeatplan(payload) {
        payload.row.doDELETE().then(function () {
            vm.store.dispatch('getData');
        }, function (response) {
            console.log(response);
        });
    }

    function editSeatplan(payload) {
        $state.go('app.seatplans.edit', {id: payload.row.id, seatplan: payload.row, store: vm.store});
    }

}