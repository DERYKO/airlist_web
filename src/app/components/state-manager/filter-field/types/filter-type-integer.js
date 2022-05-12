import templateUrl from './integer.tpl.html';

angular
    .module('airlst.components')
    .component('filterInteger', {
        bindings: {
            store: '<',
            col: '<',
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });