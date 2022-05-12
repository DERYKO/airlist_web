import Payments from '../../../../store/billing/payments/index';

angular
    .module('airlst.billing.invoices')
    .factory('Payments', [
        '$injector',
        'Payment',
        ($injector, Payment) => new Payments(Payment, {
            injector: $injector
        })
    ]);
