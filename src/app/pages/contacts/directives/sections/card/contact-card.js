import templateUrl from './contact-card.tpl.html';

angular
    .module('airlst.contacts')
    .component('contactCard', {
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