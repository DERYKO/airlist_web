import templateUrl from './listview-grid.tpl.html';

angular
    .module('airlst.components')
    .component('listviewGrid', {
        bindings: {
            store: '=',
        },
        controller() {
            this.lodash = _;
            this.$onInit = () => {
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });
