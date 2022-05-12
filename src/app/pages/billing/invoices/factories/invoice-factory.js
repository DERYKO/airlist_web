/**
 * @ngdoc service
 * @name billing.invoices.factory:Invoices
 *
 * @description
 *
 */
import Templates from '../../../../store/templates/main/index';

angular
    .module('airlst.billing.invoices')
    .factory('Invoice', [
        'locale',
        'Resource',
        'FileSaver',
        'SweetAlert',
        'Env',
        '$http',
        'SelectBox',
        'Template',
        '$injector',
        Invoice
    ]);

function Invoice(locale, Resource, FileSaver, SweetAlert, Env, $http, SelectBox, Template, $injector) {
    const $model = Resource.make('billing/invoices');
    $model.title = 'Invoice ';

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

    $model.downloadInvoice = function (id, name) {
        if (!name) {
            name = 'invoice-' + id + '.pdf';
        }
        $http.get(Env.apiUrl + '/billing/invoices/' + id + '/download', {responseType: "blob"})
            .then(function (response) {
                var blob = new Blob([response.data], {type: response.headers('content-type')});
                FileSaver.saveAs(blob, name);
            }, function (response) {
                SweetAlert.error(response.data.message);
            });
    };

    $model.finishInvoice = function (invoice) {
        return $http.get(Env.apiUrl + '/billing/invoices/' + invoice.id + '/finish')
            .then(function (response) {
                SweetAlert.success('Success', 'finished invoice successful');
            }, function (response) {
                SweetAlert.error(response.data.message);
            });
    };

    $model.cancelInvoice = function (invoice, data) {
        return $http.put(Env.apiUrl + '/billing/invoices/' + invoice.id + '/cancel', data);
    };

    $model.sendInvoice = function (invoice, contact) {
        SelectBox.single(new Templates(Template, {
            injector: $injector
        })).then(function (result) {
            $http.post(Env.apiUrl + '/billing/invoices/' + invoice.id + '/send', {
                send_to_email: contact.preferred_email,
                template_id: result.data,
                contact_id: contact.id
            }).then(function (response) {
                SweetAlert.success('Success', 'send invoice successful');
            }, function (response) {
                SweetAlert.error(response.data.message);
            });
        });

    };

    return $model;
}