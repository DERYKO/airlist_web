import template from './contact-picklists.tpl.html';

class ContactPicklistsPreviewCtrl {
    constructor(Alert, $http, $state) {
        this.back = $state.current.name;
        this.backParams = $state.current.params;
    }
}

angular
    .module('airlst.components')
    .component('contactPicklistsPreview', {
        bindings: {
            picklists: '<',
            store: '<',
        },
        controller: ['Alert', '$http', '$state', ContactPicklistsPreviewCtrl],
        controllerAs: 'vm',
        templateUrl: template
    });