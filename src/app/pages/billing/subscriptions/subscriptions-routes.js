import mainTemplate from './views/main.tpl.html';
import listTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';

angular
    .module('airlst.billing.subscriptions')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing.subscriptions', {
            abstract: true,
            url: 'subscriptions',
            templateUrl: mainTemplate,
            data: {
                pageTitle: 'Subscription'
            }
        })
        .state('app.billing.subscriptions.index', {
            url: '',
            sticky: true,
            data: {
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'SubscriptionListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.subscriptions.create', {
            url: '/create',
            data: {
                view: 'editor'
            },
            params: {
                positionCategory: undefined,
                store: undefined
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'SubscriptionCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.subscriptions.edit', {
            url: '/{id}/edit',
            params: {
                positionCategory: undefined,
                store: undefined
            },
            data: {
                view: 'editor'
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'SubscriptionEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}