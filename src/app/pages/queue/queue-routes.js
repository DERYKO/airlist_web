import listTemplate from './views/list.tpl.html';
import QueueListController from './controllers/list-controller';

angular
    .module('airlst.queue')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.queue', {
            abstract: true,
            url: '/jobs',
            data: {
                pageTitle: 'Job Log'
            }
        })
        .state('app.queue.index', {
            url: '',
            sticky: true,
            data: {
                rights: 'queue::list'
            },
            templateUrl: listTemplate,
            controller: QueueListController,
            controllerAs: 'vm'
        });
}
