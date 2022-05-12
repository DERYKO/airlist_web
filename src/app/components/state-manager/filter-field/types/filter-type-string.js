import templateUrl from './string.tpl.html';

angular
    .module('airlst.components')
    .component('filterString', {
        bindings: {
            store: '<',
            col: '<',
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });