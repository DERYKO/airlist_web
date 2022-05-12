import templateUrl from './active-subscriptions.tpl.html';

angular
    .module('airlst.contacts')
    .component('contactActiveSubscriptions', {
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