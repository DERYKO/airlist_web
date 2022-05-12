import './invoice_templates/invoice_templates-module';
import './position_categories/position_categories-module';
import './positions/positions-module';
import './position_links/position_links-module';
import './invoices/invoices-module';
import './number-circles/number-circle-module';
import './subscriptions/subscriptions-module';
import './stripe/stripe-module';

/**
 * @ngdoc object
 * @name billing
 * @description
 *
 */
angular
    .module('airlst.billing', [
        'ui.router',
        'airlst.components',
        'airlst.billing.invoice_templates',
        'airlst.billing.position_categories',
        'airlst.billing.positions',
        'airlst.billing.invoices',
        'airlst.billing.position_links',
        'airlst.billing.number-circles',
        'airlst.billing.subscriptions',
        'airlst.billing.stripe',
        //'ngListView'
    ]);


require('./billing-routes');