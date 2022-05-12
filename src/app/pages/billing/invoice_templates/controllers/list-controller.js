import InvoiceTemplates from '../../../../store/billing/invoice_templates/index';
/**
 * @ngdoc object
 * @name billing.invoice_templates.controller:ListCtrl
 *
 * @description
 *
 */

angular
    .module('airlst.billing.invoice_templates')
    .controller('InvoiceTemplatesListCtrl', [
        'InvoiceTemplate',
        '$state',
        '$injector',
        ListCtrl
    ]);

function ListCtrl(InvoiceTemplate, $state, $injector) {
    const vm = this;
    vm.model = InvoiceTemplate;
    vm.name = 'InvoiceTemplateListView';

    init();

    function init() {
        vm.store = new InvoiceTemplates(InvoiceTemplate, {
            injector: $injector
        });
        vm.edit = edit;
        vm.addNew = addNew;
        vm.store.commit('setVm', vm);
    }

    function addNew() {
        $state.go('app.billing.invoice_templates.create', {manager: vm.manager});
    }

    function edit(event) {
        $state.go('app.billing.invoice_templates.edit', {id: event.row.id, manager: vm.manager});
    }

}