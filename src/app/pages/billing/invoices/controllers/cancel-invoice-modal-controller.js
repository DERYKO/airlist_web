/**
 * @ngdoc object
 * @name billing.invoices.controller:InvoicesCancelModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoicesCancelModalCtrl', [
        'Invoice',
        '$uibModalInstance',
        'invoice',
        'InvoiceTemplate',
        '$scope',
        CreateModalCtrl
    ]);

function CreateModalCtrl(Invoice, $uibModalInstance, invoice, InvoiceTemplate, $scope) {
    const vm = this;

    vm.close = close;
    vm.submit = submit;
    vm.invoice = invoice;
    vm.data = {
        cancellation_date: new Date()
    };
    vm.template = null;
    vm.invoiceTemplates = [];
    vm.submitting = false;
    vm.loading = false;

    init();

    function init(){
        _loadTemplates();
        _initWatchers();
    }

    function _loadTemplates() {
        vm.loading = true;
        vm.invoiceTemplates = [];
        InvoiceTemplate.getList().then(function (collection) {
            _.forEach(collection, function (v, k) {
                if(v.enable_for_cancellation) {
                    vm.invoiceTemplates.push(v.plain());
                }
            });

            if(!vm.template) {
                vm.template = vm.invoiceTemplates[0];
            }

            vm.loading = false;
        });
    }

    function _initWatchers() {
        $scope.$watch('vm.template', function (value) {
            vm.data.template_id = value.id;
            const fieldsToCopyFromTemplate = [
                'subject',
                'number_circle_id',
                'text1',
                'text2',
                'text3',
                'tax_rate'
            ];

            for (let i = 0; i < fieldsToCopyFromTemplate.length; i++) {
                const fieldName = fieldsToCopyFromTemplate[i];
                vm.data[fieldName] = vm.template[fieldName];
            }
        });
    }

    function submit(){
        vm.submitting = true;
        return Invoice.cancelInvoice(vm.invoice, vm.data).then(function (cancellation) {
            $uibModalInstance.close(cancellation);
        }, function (e) {
            $uibModalInstance.dismiss(e);
        });
    }

    function close(){
        $uibModalInstance.dismiss(true);
    }
}
