import mainTemplate from './views/main.tpl.html';
import listTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';

angular
    .module('airlst.billing.position_categories')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing.position_categories', {
            abstract: true,
            url: 'positions/categories',
            templateUrl: mainTemplate,
            data: {
                pageTitle: 'Position categories'
            }
        })
        .state('app.billing.position_categories.index', {
            url: '',
            sticky: true,
            data: {
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'PositionCategoriesListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.position_categories.create', {
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
                    controller: 'PositionCategoriesCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.position_categories.edit', {
            url: '/{id}/edit',
            params: {
                positionCategory: undefined,
                store: undefined
            },
            data: {
                view: 'editor'
            },
            resolve: {
                model: [
                    'locale',
                    'PositionCategory',
                    '$stateParams',
                    'SweetAlert',
                    function (locale, PositionCategory, $stateParams, SweetAlert) {
                        return PositionCategory.one($stateParams.id).get().then(function (response) {
                            return response;
                        }, function () {
                            SweetAlert.error(locale.getString('billing.position_categories.not_found'), locale.getString('billing.position_categories.not_found_message'));
                            $state.go('app.billing.position_categories.index');
                        });
                    }
                ]
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'PositionCategoriesEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}