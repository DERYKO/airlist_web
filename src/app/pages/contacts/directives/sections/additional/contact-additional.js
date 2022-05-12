import templateUrl from './contact-additional.tpl.html';

angular
    .module('airlst.contacts')
    .component('contactAdditional', {
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