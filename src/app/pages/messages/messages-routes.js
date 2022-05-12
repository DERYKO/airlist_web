import baseTemplate from './views/messages.tpl.html';
import listTemplate from './views/messages-list.tpl.html';
import createTemplate from './views/messages-create.tpl.html';
import detailsTemplate from './views/messages-details.tpl.html';

angular
    .module('airlst.messages')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.messages', {
            abstract: true,
            templateUrl: baseTemplate,
            data: {
                module: 'messages',
                pageTitle: 'Messages',
                showBackBtn: true
            },
            params: {
                back: 'app.messages.index',
            },
        })
        .state('app.messages.index', {
            url: '/messages',
            sticky: true,
            data: {
                showBackBtn: false,
                rights: 'messages::list',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'MessagesCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.messages.create', {
            url: '/messages/create',
            sticky: true,
            params: {
                store: undefined,
                recipients: undefined,
                type: 'contact',
            },
            data: {
                rights:'messages::send',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: createTemplate,
                    controller: 'MessagesCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.messages.details', {
            url: '/messages/{id}',
            sticky: true,
            params: {
                store: undefined,
                backParams: ['$stateParams', ($stateParams) => {
                    return {
                        id: $stateParams.id,
                        store: $stateParams.store,
                    }
                }],
            },
            data: {
                rights: 'messages::view',
                view: 'details'
            },
            views: {
                details: {
                    templateUrl: detailsTemplate,
                    controller: 'MessagesDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
