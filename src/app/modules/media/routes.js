import DownloadController from './controllers/download-controller';
import downloadTemplateUrl from './views/download.tpl.html';

angular
    .module('airlst.modules.media')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.media', {
            abstract: true,
            url: '/media',
            template: '<ui-view/>'
        })
        .state('app.media.downloads', {
            url: '/download/{fileUuid}',
            controller: DownloadController,
            controllerAs: 'vm',
            templateUrl: downloadTemplateUrl,
        })
}
