/**
 * @ngdoc object
 * @name billing.position_categories.controller:ListCtrl
 *
 * @description
 *
 */
import PositionCategories from '../../../../store/billing/position_categories/index';

angular
    .module('airlst.billing.position_categories')
    .controller('PositionCategoriesListCtrl', [
        'PositionCategory',
        '$state',
        '$injector',
        ListCtrl
    ]);

function ListCtrl(PositionCategory, $state, $injector) {
    const vm = this;

    init();

    function init() {
        vm.store = new PositionCategories(PositionCategory, {
            injector: $injector
        });
        vm.addNew = addNew;
        vm.edit = edit;
        vm.store.commit('setVm', vm);
    }

    function addNew() {
        $state.go('app.billing.position_categories.create', {manager: vm.manager});
    }

    function edit(event) {
        $state.go('app.billing.position_categories.edit', {id: event.row.id, manager: vm.manager});
    }
}