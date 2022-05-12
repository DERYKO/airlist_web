import mainTemplate from './views/main.tpl.html';
import listTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';

angular
    .module('airlst.billing.invoice_templates')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing.invoice_templates', {
            abstract: true,
            url: 'invoices/templates',
            templateUrl: mainTemplate,
            data: {
                pageTitle: 'Invoice Templates'
            }
        })
        .state('app.billing.invoice_templates.index', {
            url: '/',
            sticky: true,
            data: {
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'InvoiceTemplatesListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.invoice_templates.create', {
            url: '/create',
            data: {
                view: 'editor'
            },
            params: {
                invoiceTemplate: undefined,
                store: undefined
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'InvoiceTemplatesCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.invoice_templates.edit', {
            url: '/{id}/edit',
            params: {
                invoiceTemplate: undefined,
                store: undefined
            },
            data: {
                view: 'editor'
            },
            resolve: {
                model: [
                    'locale',
                    'InvoiceTemplate',
                    '$stateParams',
                    'SweetAlert',
                    function (locale, InvoiceTemplate, $stateParams, SweetAlert) {
                        return InvoiceTemplate.one($stateParams.id).get().then(function (response) {
                            return response;
                        }, function () {
                            SweetAlert.error(locale.getString('billing.invoice_templates.not_found'), locale.getString('billing.invoice_templates.not_found_message'));
                            $state.go('app.billing.invoice_templates.index');
                        });
                    }
                ]
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'InvoiceTemplatesEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}