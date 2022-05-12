import baseTemplate from './views/base.tpl.html';
import listTemplate from './views/list.tpl.html';
import editorTemplate from './views/editor.tpl.html';
import detailsTemplate from './views/details.tpl.html';

angular
    .module('airlst.tickets')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.tickets', {
            abstract: true,
            templateUrl: baseTemplate,
            data: {
                module: 'tickets',
                showBackBtn: true,
                pageTitle: 'Tickets'
            },
            params:{
                back: 'app.tickets.details',
            },
        })
        .state('app.tickets.index', {
            url: '/tickets',
            sticky: true,
            data: {
                showBackBtn: false,
                rights: 'tickets::list',
                view: 'index'
            },
            views: {
                index: {
                    templateUrl: listTemplate,
                    controller: 'TicketsCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.tickets.create', {
            url: '/tickets/create',
            sticky: true,
            data: {
                rights: 'tickets::create',
                view: 'details'
            },
            params: {
                back: 'app.tickets.index',
                store: undefined
            },
            views: {
                details: {
                    templateUrl: editorTemplate,
                    controller: 'TicketsCreateCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.tickets.edit', {
            url: '/tickets/{id}/edit',
            sticky: true,
            data: {
                rights: 'tickets::edit',
                view: 'details'
            },
            params: {
                ticket: undefined,
                backParams: {},
                store: undefined
            },

            views: {
                details: {
                    templateUrl: editorTemplate,
                    controller: 'TicketsEditCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.tickets.details', {
            url: '/tickets/{id}',
            sticky: true,
            params: {
                ticket: undefined,
                back: 'app.tickets.details',
                backParams: {},
                store: undefined
            },
            data: {
                rights: 'tickets::view',
                view: 'details'
            },

            views: {
                details: {
                    templateUrl: detailsTemplate,
                    controller: 'TicketDetailsCtrl',
                    controllerAs: 'vm'
                }
            }
        });
}
