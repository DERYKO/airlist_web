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
            this.increaseLimit = (type) => {
                vm.limits[type] += 5;
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });