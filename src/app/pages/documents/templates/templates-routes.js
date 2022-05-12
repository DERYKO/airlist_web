import mainTemplate from './views/main.tpl.html';
import listTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';
import detailsTemplate from './views/details.tpl.html';

angular
    .module('airlst.documents.templates')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.documents.templates', {
            abstract: true,
            templateUrl: mainTemplate,
            params: {
                back: 'app.documents.templates.index',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        store: $stateParams.store,
                    }
                }],
            },
            data: {
                showBackBtn: true,
                pageTitle: 'Document Templates'
            }
        })
        .state('app.documents.templates.index', {
            url: 'templates',
            sticky: true,
            data: {
                showBackBtn: false,
                rights: 'documents::template-list',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'DocumentsTemplatesListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.documents.templates.create', {
            url: 'templates/create',
            data: {
                rights: 'documents::template-create',
                view: 'editor'
            },
            params: {
                store: undefined
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'DocumentsTemplatesCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.documents.templates.details', {
            url: 'templates/{id}',
            params: {
                store: undefined,
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        id: $stateParams.id,
                        store: $stateParams.store,
                    }
                }],
            },
            sticky: true,
            data: {
                rights: 'documents::template-view',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: detailsTemplate,
                    controller: 'DocumentsTemplatesDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.documents.templates.edit', {
            url: 'templates/{id}/edit',
            params: {
                store: undefined,
                back: 'app.documents.templates.details',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        id: $stateParams.id,
                        store: $stateParams.store,
                    }
                }],
            },
            sticky: true,
            data: {
                rights: 'documents::template-edit',
                view: 'editor'
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'DocumentsTemplatesEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
