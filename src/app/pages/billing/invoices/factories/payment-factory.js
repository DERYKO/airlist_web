angular
    .module('airlst.billing.invoices')
    .factory('Payment', [
        'locale',
        'Resource',
        Payment
    ]);

function Payment(locale, Resource) {
    const $model = Resource.make('billing/payments');
    $model.title = 'Payment ';

    locale.ready(['billing']).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('billing.invoices.title'),
            properties: {
                id: {
                    title: locale.getString('billing.invoices.fields.id'),
                    type: 'number',
                    listview: 'hidden'
                },
                invoice_number: {
                    title: locale.getString('billing.invoices.fields.invoice_number'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                number_circle_id: {
                    title: locale.getString('billing.invoices.fields.number_circle_id'),
                    type: 'number',
                    listview: 'hidden'
                },
                type: {
                    title: locale.getString('billing.invoices.fields.type'),
                    type: 'integer',
                    columnDef: {}
                },
                status: {
                    title: locale.getString('billing.invoices.fields.status'),
                    type: 'integer',
                    columnDef: {}
                },
                tax_rate: {
                    title: locale.getString('billing.invoices.fields.tax_rate'),
                    type: 'number',
                    columnDef: {}
                },
                subject: {
                    title: locale.getString('billing.invoices.fields.subject'),
                    type: 'string',
                    columnDef: {}
                },
                performance_period: {
                    title: locale.getString('billing.invoices.fields.performance_period'),
                    type: 'string',
                    columnDef: {}
                },
                text1: {
                    title: locale.getString('billing.invoices.fields.text1'),
                    type: 'string',
                    columnDef: {}
                },
                text2: {
                    title: locale.getString('billing.invoices.fields.text2'),
                    type: 'string',
                    columnDef: {}
                },
                text3: {
                    title: locale.getString('billing.invoices.fields.text3'),
                    type: 'string',
                    columnDef: {}
                }
            }
        };
    });


    $model.form = [
        'title',
        'label',
        'description',
        'unit',
        'price_per_unit'
    ];

    return $model;
}