import templateUrl from './contact-overview.tpl.html';

angular
    .module('airlst.contacts')
    .component('contactOverview', {
        bindings: {
            contact: '=',
        },
        controller() {
            this.$onInit = () => {
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });