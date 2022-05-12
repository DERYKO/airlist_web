/**
 * @ngdoc object
 * @name billing.invoices:InvoicesPaymentCreateModalCtrl
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoices')
    .controller('InvoicesPaymentCreateModalCtrl', [
        'invoice',
        'Invoice',
        'closeFunction',
        'SweetAlert',
        InvoicesPaymentCreateModalCtrl
    ]);

function InvoicesPaymentCreateModalCtrl(invoice, Invoice, closeFunction, SweetAlert) {
    const vm = this;

    vm.model = {
        type: '',
        amount: invoice.sum_brutto,
        payment_time: new Date(),
        status: 'success'
    };
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
        }
    ];
    vm.allowTypeChange = true;
    vm.enableDelete = false;

    vm.close = close;
    vm.save = save;

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

        vm.model.type = vm.types[0].key;
    }

    function save() {
        var dataForApi = _.cloneDeep(vm.model);

        Invoice.one(invoice.id).post('payments', dataForApi).then(function () {
            SweetAlert.success('success', 'payment created');
            vm.close();
        });
    }

    function close() {
        closeFunction();
    }
}