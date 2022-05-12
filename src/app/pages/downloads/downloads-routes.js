import templateUrl from './views/downloading.tpl.html'


angular
    .module('airlst.downloads', ['ngFileSaver'])
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.download', {
            url: '/download/{type}/{file}',
            controller: 'DownloadsCtrl',
            controllerAs: 'vm',
            templateUrl,
        })
        .state('app.download-file', {
            url: '/download/{file}?name',
            controller: 'DownloadsCtrl',
            controllerAs: 'vm',
            templateUrl,
        })
}

// Controllers
require('./controllers/downloads-controller');