import mainTemplate from './views/main.tpl.html';
import listTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';

angular
    .module('airlst.billing.positions')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing.positions', {
            abstract: true,
            url: 'positions',
            templateUrl: mainTemplate,
            data: {
                pageTitle: 'Position',
                showBackBtn: false
            }
        })
        .state('app.billing.positions.index', {
            url: '',
            sticky: true,
            data: {
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'PositionListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.positions.create', {
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
                    controller: 'PositionCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.positions.edit', {
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
                    'Position',
                    '$stateParams',
                    'SweetAlert',
                    function (locale, Position, $stateParams, SweetAlert) {
                        return Position.one($stateParams.id).get().then(function (response) {
                            return response;
                        }, function () {
                            SweetAlert.error(locale.getString('billing.positions.not_found'), locale.getString('billing.positions.not_found_message'));
                            $state.go('app.billing.positions.index');
                        });
                    }
                ]
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'PositionEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}