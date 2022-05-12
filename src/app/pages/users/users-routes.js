import mainTemplate from './views/users.tpl.html';
import listTemplate from './views/users-list.tpl.html';
import editorTemplate from './views/users-editor.tpl.html';
import createTemplate from './views/users-create.tpl.html';
import detailsTemplate from './views/users-detail-view.tpl.html';

angular
    .module('airlst.users')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.users', {
            abstract: true,
            templateUrl: mainTemplate,
            reloadOnSearch: false,
            data: {
                pageTitle: 'Users'
            }
        })
        .state('app.users.index', {
            url: '/users',
            sticky: true,
            data: {
                rights: 'users::list',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'UsersListCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.users.create', {
            url: '/users/create',
            data: {
                rights: 'users::create',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: createTemplate,
                    controller: 'UsersCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.users.details', {
            url: '/users/{id}',
            params: {
                user: undefined,
                store: undefined
            },
            sticky: true,
            data: {
                rights: 'users::view',
                view: 'details'
            },
            views: {
                'details': {
                    templateUrl: detailsTemplate,
                    controller: 'UsersDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.users.edit', {
            url: '/users/{id}/edit',
            params: {
                user: undefined,
                store: undefined
            },
            sticky: true,
            data: {
                rights: 'users::edit',
                view: 'details'
            },
            views: {
                'details': {
                    templateUrl: editorTemplate,
                    controller: 'UsersEditCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
