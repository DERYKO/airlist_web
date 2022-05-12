/**
 * @ngdoc object
 * @name billing.invoices:InvoicesPaymentEditModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoicesPaymentEditModalCtrl', [
        'invoice',
        'payment',
        'Invoice',
        'closeFunction',
        'SweetAlert',
        'Error',
        InvoicesPaymentEditModalCtrl
    ]);

function InvoicesPaymentEditModalCtrl(invoice, payment, Invoice, closeFunction, SweetAlert, Error) {
    const vm = this;

    vm.model = payment;
    vm.allowTypeChange = false;
    vm.enableDelete = true;
    vm.types = [];
    vm.states = [
        {
            key: 'success',
            label: 'Success'
        },
        {
            key: 'failed',
            label: 'Failed'
        },
        {
            key: 'pending',
            label: 'Pending'
        },
        {
            key: 'refund',
            label: 'Refund'
        }
    ];

    vm.close = close;
    vm.save = save;
    vm.deletePayment = deletePayment;

    init();

    function init() {
        initTypes();
    }

    function initTypes() {
        vm.types = [
            {
                key: 'bank',
                title: 'Bank'
            },
            {
                key: 'direct_debit',
                title: 'Direct Debit'
            },
            {
                key: 'credit_card',
                title: 'Credit Card'
            },
            {
                key: 'credit',
                title: 'Credit'
            },
            {
                key: 'cash',
                title: 'Cash'
            },
            {
                key: 'other',
                title: 'Other'
            }
        ];
    }

    function save() {
        Invoice.one(invoice.id).customPUT(_.cloneDeep(vm.model), 'payments/' + vm.model.id).then(function () {
            SweetAlert.success('success', 'payment saved');
            vm.close();
        });
    }

    function deletePayment() {
        SweetAlert.swal({
                title: "Delete?",
                text: "Are you sure you want to delete this payment?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function (isConfirmed) {
                if (isConfirmed) {
                    Invoice.one(invoice.id).customDELETE('payments/' + vm.model.id).then(function(){
                        SweetAlert.info('deleted', 'payment was deleted successful');
                        vm.close();
                    }, function(error) {
                        Error.default(error);
                        vm.close();
                    });
                }
            });
    }

    function close() {
        closeFunction();
    }
}