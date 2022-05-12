import template from './views/toolbox.tpl.html';

angular
    .module('airlst.toolbox')
    .config([
        '$stateProvider',
        config
    ]);

function config($stateProvider) {
    $stateProvider
        .state('app.toolbox', {
            url: '/toolbox',
            templateUrl: template,
            controller: 'ToolboxCtrl',
            controllerAs: 'toolbox'
        });
}