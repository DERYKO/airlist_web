/**
 * @ngdoc service
 * @name billing.subscriptions.factory:Positions
 *
 * @description
 *
 */
angular
    .module('airlst.billing.subscriptions')
    .factory('Subscription', [
        'locale',
        'Resource',
        Subscription
    ]);

function Subscription(locale, Resource) {
    var $model = Resource.make('billing/subscriptions');
    $model.title = 'Subscriptions ';

    locale.ready(['billing']).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('billing.subscriptions.title'),
            properties: {
                id: {
                    title: locale.getString('billing.subscriptions.fields.id'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                title: {
                    title: locale.getString('billing.subscriptions.fields.title'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                label: {
                    title: locale.getString('billing.subscriptions.fields.label'),
                    type: 'string',
                    columnDef: {}
                },
                description: {
                    title: locale.getString('billing.subscriptions.fields.description'),
                    type: 'string',
                    listview: 'hidden',
                    columnDef: {}
                },
                invoice_template_id: {
                    title: locale.getString('billing.subscriptions.fields.invoice_template_id'),
                    type: 'string',
                    listview: 'hidden',
                    columnDef: {}
                },
                invoicing_interval_value: {
                    title: locale.getString('billing.subscriptions.fields.invoicing_interval_value'),
                    type: 'string',
                    listview: 'hidden',
                    columnDef: {}
                },
                invoicing_interval_type: {
                    title: locale.getString('billing.subscriptions.fields.invoicing_interval_type'),
                    type: 'string',
                    listview: 'hidden',
                    columnDef: {},
                    enum: ['year', 'month', 'week', 'day'],
                    titleMap: [
                        { value: 'year', name: locale.getString('billing.subscriptions.invoicing_interval_types.year') },
                        { value: 'month', name: locale.getString('billing.subscriptions.invoicing_interval_types.month') },
                        { value: 'week', name: locale.getString('billing.subscriptions.invoicing_interval_types.week') },
                        { value: 'day', name: locale.getString('billing.subscriptions.invoicing_interval_types.day') }
                    ]
                }
            }
        };
    });


    $model.form = [
        'title',
        'label',
        'invoice_template_id',
        'description'
    ];

    return $model;
}