import mainTemplate from './views/main.tpl.html';
import listTemplate from './views/list.tpl.html';
import detailsTemplate from './views/details.tpl.html';

angular
    .module('airlst.billing.invoices')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing.invoices', {
            abstract: true,
            url: 'invoices',
            templateUrl: mainTemplate,
            data: {
                pageTitle: 'Invoice'
            }
        })
        .state('app.billing.invoices.index', {
            url: '',
            sticky: true,
            data: {
                bodyClass: 'wide',
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'InvoiceListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.invoices.details', {
            url: '/{id}/details',
            params: {
                store: undefined
            },
            data: {
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: detailsTemplate,
                    controller: 'InvoiceDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}