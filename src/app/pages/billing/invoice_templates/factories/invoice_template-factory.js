/**
 * @ngdoc service
 * @name billing.invoice_templates.factory:InvoiceTemplates
 *
 * @description
 *
 */
angular
    .module('airlst.billing.invoice_templates')
    .factory('InvoiceTemplate', [
        'locale',
        'Resource',
        InvoiceTemplate
    ]);

function InvoiceTemplate(locale, Resource) {
    var $model = Resource.make('billing/invoices/templates');
    $model.title = 'Invoice Templates';

    locale.ready(['billing']).then(function () {
        $model.schema = {
            type: 'object',
            title: locale.getString('billing.invoice_templates.title'),
            properties: {
                id: {
                    title: locale.getString('billing.invoice_templates.fields.id'),
                    type: 'number',
                    listview: 'hidden',
                    mergeable: false
                },
                title: {
                    title: locale.getString('billing.invoice_templates.fields.title'),
                    type: 'string',
                    columnDef: {
                        main: true
                    }
                },
                number_circle_id: {
                    title: locale.getString('billing.invoice_templates.fields.number_circle_id'),
                    type: 'number',
                    listview: 'hidden'
                },
                subject: {
                    title: locale.getString('billing.invoice_templates.fields.subject'),
                    type: 'string'
                },
                text1: {
                    title: locale.getString('billing.invoice_templates.fields.text1'),
                    type: 'string',
                    'x-schema-form': {
                        type: 'textarea'
                    }
                },
                text2: {
                    title: locale.getString('billing.invoice_templates.fields.text2'),
                    type: 'string',
                    'x-schema-form': {
                        type: 'textarea'
                    }
                },
                text3: {
                    title: locale.getString('billing.invoice_templates.fields.text3'),
                    type: 'string',
                    'x-schema-form': {
                        type: 'textarea'
                    }
                },
                tax_rate: {
                    title: locale.getString('billing.invoice_templates.fields.tax_rate'),
                    type: 'number'
                }
            }
        };
    });


    $model.form = [
        'title',
        'text1',
        'text2',
        'text3',
        'subject',
        'tax_rate'
    ];

    return $model;
}