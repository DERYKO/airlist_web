import templateUrl from './social-profiles.tpl.html';

angular
    .module('airlst.contacts')
    .component('contactSocialProfiles', {
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