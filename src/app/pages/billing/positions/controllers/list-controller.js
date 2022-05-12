import Positions from '../../../../store/billing/positions/index';
/**
 * @ngdoc object
 * @name billing.positions.controller:ListCtrl
 *
 * @description
 *
 */

angular
    .module('airlst.billing.positions')
    .controller('PositionListCtrl', [
        'Position',
        '$state',
        '$injector',
        ListCtrl
    ]);

function ListCtrl(Position, $state, $injector) {
    const vm = this;

    init();

    function init() {
        vm.store = new Positions(Position, {
            injector: $injector
        });
        vm.addNew = addNew;
        vm.edit = edit;
        vm.store.commit('setVm', vm);
    }

    function addNew() {
        $state.go('app.billing.positions.create', {manager: vm.manager});
    }

    function edit(event) {
        $state.go('app.billing.positions.edit', {id: event.row.id, manager: vm.manager});
    }
}