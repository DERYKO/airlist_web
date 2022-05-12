/**
 * @ngdoc object
 * @name billing.invoices.controller:ListCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoiceListCtrl', [
        '$state',
        'Invoices',
        ListCtrl
    ]);

function ListCtrl($state, Invoices) {
    const vm = this;

    init();

    function init() {
        vm.showDetails = showDetails;
        vm.addNew = addNew;
        vm.store = Invoices.reset();
        vm.store.dispatch('loadWorkflows', 'billing::invoice-list');
        vm.store.commit('setVm', vm);
    }

    function showDetails(action) {
        $state.go('app.billing.invoices.details', {id: action.row.id, store: vm.store});
    }

    function addNew() {
        //@todo new invoice
    }

}
