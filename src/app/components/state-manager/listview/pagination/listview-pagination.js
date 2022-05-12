import templateUrl from './listview-pagination.tpl.html';

angular
    .module('airlst.components')
    .component('listviewPagination', {
        bindings: {
            store: '=',
        },
        controller() {
            this.$onInit = () => {
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });