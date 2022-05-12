import NumberCircles from '../../../../store/billing/number_circles/index';
/**
 * @ngdoc object
 * @name billing.number-circles.controller:ListCtrl
 *
 * @description
 *
 */

angular
    .module('airlst.billing.number-circles')
    .controller('NumberCircleListCtrl', [
        'NumberCircle',
        '$state',
        '$injector',
        ListCtrl
    ]);

function ListCtrl(NumberCircle, $state, $injector) {
    const vm = this;

    init();

    function init() {
        vm.store = new NumberCircles(NumberCircle, {
            injector: $injector
        });
        vm.edit = edit;
        vm.addNew = addNew;
        vm.store.commit('setVm', vm);
    }

    function addNew() {
        $state.go('app.billing.number-circles.create', {manager: vm.manager});
    }

    function edit(event) {
        $state.go('app.billing.number-circles.edit', {id: event.row.id, manager: vm.manager});
    }
}