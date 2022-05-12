import template from './message-preview.tpl.html';

class MessagePreviewCtrl {


}

angular
    .module('airlst.components')
    .component('messagePreview', {
        bindings: {
            message: '<',
        },
        controller: ['Alert', '$http', MessagePreviewCtrl],
        controllerAs: 'vm',
        templateUrl: template
    });