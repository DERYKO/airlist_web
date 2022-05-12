import templateUrl from './contact-address.tpl.html';

angular
    .module('airlst.contacts')
    .component('contactAddress', {
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