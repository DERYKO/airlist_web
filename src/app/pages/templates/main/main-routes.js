import baseTemplate from './views/templates.tpl.html';
import listTemplate from './views/templates-list.tpl.html';
import editorTemplate from './views/templates-editor.tpl.html';
import detailsTemplate from './views/templates-details.tpl.html';

angular
    .module('airlst.templates.main')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.templates.main', {
            abstract: true,
            templateUrl: baseTemplate,
            data: {
                module: 'templates',
                showBackBtn: true,
                back: 'app.templates.main.index',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        store: $stateParams.store,
                    }
                }],
                pageTitle: 'Templates'
            }
        })
        .state('app.templates.main.index', {
            url: '/',
            sticky: true,
            data: {
                showBackBtn: false,
                rights: 'templates::list',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'TemplatesCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.templates.main.create', {
            url: '/create',
            data: {
                rights: 'templates::create',
                view: 'details'
            },
            params: {
                template: undefined,
                store: undefined
            },
            views: {
                details: {
                    templateUrl: editorTemplate,
                    controller: 'TemplatesCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.templates.main.details', {
            url: '/{id:int}',
            sticky: true,
            params: {
                template: undefined,
                store: undefined,
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        store: $stateParams.store,
                    }
                }],
            },
            data: {
                rights: 'templates::view',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: detailsTemplate,
                    controller: 'TemplatesDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.templates.main.edit', {
            url: '/{id:int}/edit',
            params: {
                template: undefined,
                store: undefined,
                back: 'app.templates.main.details',
                backParams: ['$location', '$stateParams', ($location, $stateParams) => {
                    return {
                        id: $stateParams.id || $location.$$url.match(/templates\/(\d*)/)[1],
                        store: $stateParams.store,
                    }
                }],
            },
            data: {
                rights: 'templates::edit',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: editorTemplate,
                    controller: 'TemplatesEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
