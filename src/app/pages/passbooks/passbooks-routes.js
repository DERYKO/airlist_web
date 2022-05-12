import baseTemplate from './views/base.tpl.html';
import listTemplate from './views/list.html';
import editorTemplate from './views/editor.html';
import detailsTemplate from './views/details.html';

angular
    .module('airlst.passbooks')
    .config(['$stateProvider', config]);

function config($stateProvider) {
    $stateProvider
        .state('app.passbooks', {
            abstract: true,
            templateUrl: baseTemplate,
            data: {
                module: 'passbooks',
                pageTitle: 'Passbooks',
                showBackBtn: true
            },
        })
        .state('app.passbooks.index', {
            url: '/passbooks',
            sticky: true,
            data: {
                rights: 'passbooks::list',
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'PassbooksCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.passbooks.create', {
            url: '/passbooks/create',
            sticky: true,
            data: {
                rights: 'passbooks::edit',
                view: 'details'
            },
            params: {
                store: undefined,
                model: undefined,
            },
            views: {
                details: {
                    templateUrl: editorTemplate,
                    controller: 'PassbooksCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.passbooks.edit', {
            url: '/passbooks/{id}/edit',
            sticky: true,
            data: {
                rights: 'passbooks::edit',
                view: 'details'
            },
            params: {
                passbook: undefined,
                store: undefined
            },
            views: {
                details: {
                    templateUrl: editorTemplate,
                    controller: 'PassbooksEditCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.passbooks.details', {
            url: '/passbooks/{id}',
            sticky: true,
            params: {
                passbook: undefined,
                store: undefined
            },
            data: {
                rights: 'passbooks::view',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: detailsTemplate,
                    controller: 'PassbookDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
