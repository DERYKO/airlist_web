import templateUrl from './keyword-search.html';

angular
    .module('airlst.components')
    .component('listviewKeywordSearch', {
        bindings: {
            keyword: '<',
            onUpdate: '&'
        },
        controller() {
            this.$onInit = () => {
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });