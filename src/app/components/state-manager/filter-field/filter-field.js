import templateUrl from './filter-field.tpl.html';

import './types/filter-type-boolean';
import './types/filter-type-date';
import './types/filter-type-datetime';
import './types/filter-type-datetimeexact';
import './types/filter-type-integer';
import './types/filter-type-number';
import './types/filter-type-select';
import './types/filter-type-string';

angular
    .module('airlst.components')
    .component('filterField', {
        bindings: {
            store: '<',
            col: '<',
        },
        controller() {
            this.$onInit = () => {
            }
        },
        controllerAs: 'vm',
        templateUrl: templateUrl
    });
