import baseTemplate from './views/base.tpl.html';
import listTemplateTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';

angular
    .module('airlst.templates.types')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.templates.types', {
            abstract: true,
            templateUrl: baseTemplate,
            data: {
                module: 'templates',
                showBackBtn: true,
                pageTitle: 'Template Types'
            },
            params: {
                back: 'app.templates.types.index',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        store: $stateParams.store,
                    }
                }],
            },
        })
        .state('app.templates.types.index', {
            url: '/types',
            sticky: true,
            params: {
                store: undefined,
            },
            data: {
                showBackBtn: false,
                rights: 'templates::type-list',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplateTemplate,
                    controller: 'TemplateTypesCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.templates.types.create', {
            url: '/types/create',
            sticky: true,
            params: {
                store: undefined,
            },
            data: {
                rights: 'templates::type-create',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: editorTemplate,
                    controller: 'TemplateTypesCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.templates.types.edit', {
            url: '/types/{id:int}/edit',
            sticky: true,
            params: {
                store: undefined,
                back: 'app.templates.types.index',
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        id: $stateParams.id,
                        store: $stateParams.store,
                    }
                }],
            },
            data: {
                rights: 'templates::type-edit',
                view: 'index'
            },
            resolve: {
                model: [
                    'locale',
                    'TemplateType',
                    '$stateParams',
                    'SweetAlert',
                    function (locale, TemplateType, $stateParams, SweetAlert) {
                        if ($stateParams.template) {
                            return $stateParams.template;
                        }
                        return TemplateType.one($stateParams.id).get().then(null, function () {
                            SweetAlert.error('Not found', 'template type was not found');
                            $state.go('app.templates.types.index');
                        });
                    }
                ]
            },
            views: {
                index: {
                    templateUrl: editorTemplate,
                    controller: 'TemplateTypesEditCtrl',
                    controllerAs: 'vm'
                }
            }
        })
}
