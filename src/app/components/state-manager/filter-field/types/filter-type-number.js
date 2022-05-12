import templateUrl from './number.tpl.html';

angular
    .module('airlst.components')
    .component('filterNumber', {
        bindings: {
            store: '<',
            col: '<',
        },
        controllerAs: 'vm',
        templateUrl: templateUrl,
    });