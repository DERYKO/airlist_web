import Invoices from '../../../../store/billing/invoices/index';

angular
    .module('airlst.billing.invoices')
    .factory('Invoices', [
        '$injector',
        'Invoice',
        ($injector, Invoice) => new Invoices(Invoice, {
            injector: $injector
        })
    ]);
