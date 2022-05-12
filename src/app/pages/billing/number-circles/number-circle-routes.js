import mainTemplate from './views/main.tpl.html';
import listTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';

angular
    .module('airlst.billing.number-circles')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.billing.number-circles', {
            abstract: true,
            url: 'number-circles',
            templateUrl: mainTemplate,
            data: {
                pageTitle: 'NumberCircle'
            }
        })
        .state('app.billing.number-circles.index', {
            url: '',
            sticky: true,
            data: {
                view: 'index',
                showBackBtn: false
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'NumberCircleListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.number-circles.create', {
            url: '/create',
            data: {
                view: 'editor'
            },
            params: {
                store: undefined
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'NumberCircleCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.billing.number-circles.edit', {
            url: '/{id}/edit',
            params: {
                store: undefined
            },
            data: {
                view: 'editor'
            },
            resolve: {
                model: [
                    'locale',
                    'NumberCircle',
                    '$stateParams',
                    'SweetAlert',
                    function (locale, NumberCircle, $stateParams, SweetAlert) {
                        return NumberCircle.one($stateParams.id).get().then(function (response) {
                            return response;
                        }, function () {
                            SweetAlert.error(locale.getString('billing.number-circles.not_found'), locale.getString('billing.number-circles.not_found_message'));
                            $state.go('app.billing.number-circles.index');
                        });
                    }
                ]
            },
            views: {
                editor: {
                    templateUrl: editorTemplate,
                    controller: 'NumberCircleEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}