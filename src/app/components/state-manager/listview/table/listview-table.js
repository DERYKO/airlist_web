import templateUrl from './listview-table.tpl.html';

angular
    .module('airlst.components')
    .component('listviewTable', {
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
