import templateUrl from './boolean.tpl.html';

angular
    .module('airlst.components')
    .component('filterBoolean', {
        bindings: {
            store: '<',
            col: '<',
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });